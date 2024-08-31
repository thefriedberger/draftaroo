'use client';

import { getTimerData, setMainTimer } from '@/app/utils/helpers';
import { useWorkerTimeout } from '@/components/worker/worker-timeout';
import { DraftPick, TimerProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import _ from 'lodash';
import { createRef, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
export interface NewTimerProps extends TimerProps {
   draftId: string;
}

export type DraftTimerFields = { is_active: boolean; end_time?: number };

const NewTimer = ({
   draftId,
   yourTurn,
   currentPick,
   currentRound,
   isCompleted,
   turnOrder,
   userTeam,
   autopick,
   owner,
}: NewTimerProps) => {
   const supabase = createClientComponentClient<Database>();

   const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
   const MAIN_TIMER_DURATION = 120; // seconds
   const { setRunning, tick } = useWorkerTimeout();
   const [time, setTime] = useState(0);
   const [isTimerRunning, setIsTimerRunning] = useState(false);
   var lastTick = useRef(performance.now());
   var lastSync = useRef(performance.now());
   const [roomData, setRoomData] = useState<DraftTimerFields>({
      is_active: false,
   });
   var timerValue = useRef(120);
   const [timer, setTimer] = useState(120);
   const [userPick, setUserPick] = useState<number>();
   const [doMute, setDoMute] = useState<boolean>(false);
   const chime = createRef<HTMLAudioElement>();

   // use effects
   useEffect(() => {
      subscribeToTimerRoom(draftId, onChange);
      getData();
   }, []);

   useEffect(() => {
      if (roomData.is_active) {
         const end = roomData.end_time;
         if (end) {
            const now = Date.now();
            const diff = end - now;
            setIsTimerRunning(true);
            if (diff < 0) {
               setTimer(0);
               timerValue.current = 0;
               const newTimerEnd = Date.now() + MAIN_TIMER_DURATION * 1000;
               setMainTimer(supabase, draftId, newTimerEnd);
               if (owner) {
                  autopick();
               }
            } else {
               // can lose up to a second here depending on network latency, but the timer value needs to be less than then initial one so
               // that useEffect captures it
               const finalTimer = Math.ceil(diff / 1000);

               lastTick.current = performance.now();

               timerValue.current = finalTimer;
               setTimer(finalTimer);
               setRunning(true);
            }
         }
      } else {
         setRunning(false);
         setIsTimerRunning(false);
      }
   }, [roomData]);

   useEffect(() => {
      if (turnOrder.length && userTeam?.id) {
         setUserPick(
            Math.abs(
               Number(currentPick) -
                  turnOrder
                     .filter(
                        (turn: DraftPick) => turn.team_id === userTeam.id
                     )[0]
                     .picks.find((pick: number) => Number(currentPick) <= pick)
            )
         );
         // const closestPick = picks.picks.find(
         //    (pick: number) => Number(currentPick) <= pick
         // );
         // setUserPick(Math.abs(Number(currentPick) - closestPick));
      }
   }, [turnOrder, userTeam, currentPick]);

   useEffect(() => {
      if (tick > 0) {
         const now = performance.now();

         // run only if timer is running
         if (isTimerRunning) {
            if (now - lastTick.current >= 950) {
               if (roomData.end_time) {
                  const end = roomData.end_time;

                  const diff = end - now;

                  if (diff < 0) {
                     setTimer(0);
                     timerValue.current = 0;
                  } else {
                     timeDown(timerValue.current);
                     lastTick.current = now;
                  }
               }
            }
         }
      }
   }, [tick]);

   // end of use effects

   const subscribeToTimerRoom = (
      draftId: string,
      changeCallback: (payload: any) => void
   ) => {
      var timerTrack = supabase
         .channel(`public:draft:id=eq.${draftId}`)
         .on(
            'postgres_changes',
            {
               event: '*',
               schema: 'public',
               table: 'draft',
               filter: `id=eq.${draftId}`,
            },
            (payload) => {
               changeCallback(payload.new);
            }
         )
         .subscribe((status, e) => {
            // console.log(status, e);
         });

      return timerTrack;
   };

   const onChange = (payload: DraftTimerFields) => {
      console.log('Payload: ', payload);
      if (payload?.end_time) {
         setRoomData({
            end_time: payload.end_time,
            is_active: payload.is_active,
         });
      }
   };

   const getData = async () => {
      const draft = await getTimerData(supabase, draftId);
      if (draft) {
         setRoomData(draft);
      }
   };
   // calculate the remaining time based on what time is on the server, so we sync up
   const calculateInitialTime = () => {
      var now = performance.now();
      // console.log('sync date: ', roomData);
      if (_.isEmpty(roomData) === false) {
         if (roomData.end_time) {
            var end = roomData.end_time;

            var diff = end - now;
            if (diff < 0) {
               setTimer(0);
               timerValue.current = 0;
            } else {
               // can lose up to a second here depending on network latency, but the timer value needs to be less than then initial one so
               // that useEffect captures it
               var finalTimer = Math.ceil(diff / 1000);

               setTimer(finalTimer);
               timerValue.current = finalTimer;
            }
         } else {
            setTimer(0);
            timerValue.current = 0;
            // console.log('timer end!');
         }
      }
   };

   const timeDown = (value: number) => {
      if (isTimerRunning) {
         var t = Number(String(value)) - 1;
         if (t < 0) {
            t = 0;
         }

         //console.log("timer ", t, timer);
         timerValue.current = t;
         setTime(t);
      }
   };

   // presentation functions

   function formatTime(t: number) {
      // for hours '0' + Math.floor(t / 3600) % 24).slice(-2) + ':' +
      var finalTime =
         ('0' + (Math.floor(t / 60) % 60)).slice(-2) +
         ':' +
         ('0' + (t % 60)).slice(-2);
      return finalTime;
   }

   const getTime = () => {
      var t = timer;
      return formatTime(timerValue.current);
   };

   return (
      <div className="flex flex-col justify-between max-h-[10dvh] h-[10dvh] lg:min-h-[180px] lg:h-[180px] lg:overflow-hidden dark:text-white relative">
         {!isCompleted ? (
            <>
               {yourTurn && (
                  <audio ref={chime} controls={false} autoPlay={!doMute}>
                     <source
                        src={
                           'https://mfiegmjwkqpipahwvcbz.supabase.co/storage/v1/object/sign/audio/draft-chime.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdWRpby9kcmFmdC1jaGltZS5tcDMiLCJpYXQiOjE2OTYwOTE4NTYsImV4cCI6MTcyNzYyNzg1Nn0.ukNpIqoNGNJTTyh7_EMizjFHR3lyVb0mEV207Hh1CaE&t=2023-09-30T16%3A37%3A35.718Z'
                        }
                        type="audio/mp3"
                     />
                  </audio>
               )}
               <button
                  type="button"
                  className={
                     'w-[20px] stroke-black dark:stroke-white dark:lg:stroke-black absolute top-1 right-1 z-10'
                  }
                  onClick={() => setDoMute(!doMute)}
               >
                  {doMute ? (
                     <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           d="M16 9.50009L21 14.5001M21 9.50009L16 14.5001M4.6 9.00009H5.5012C6.05213 9.00009 6.32759 9.00009 6.58285 8.93141C6.80903 8.87056 7.02275 8.77046 7.21429 8.63566C7.43047 8.48353 7.60681 8.27191 7.95951 7.84868L10.5854 4.69758C11.0211 4.17476 11.2389 3.91335 11.4292 3.88614C11.594 3.86258 11.7597 3.92258 11.8712 4.04617C12 4.18889 12 4.52917 12 5.20973V18.7904C12 19.471 12 19.8113 11.8712 19.954C11.7597 20.0776 11.594 20.1376 11.4292 20.114C11.239 20.0868 11.0211 19.8254 10.5854 19.3026L7.95951 16.1515C7.60681 15.7283 7.43047 15.5166 7.21429 15.3645C7.02275 15.2297 6.80903 15.1296 6.58285 15.0688C6.32759 15.0001 6.05213 15.0001 5.5012 15.0001H4.6C4.03995 15.0001 3.75992 15.0001 3.54601 14.8911C3.35785 14.7952 3.20487 14.6422 3.10899 14.4541C3 14.2402 3 13.9601 3 13.4001V10.6001C3 10.04 3 9.76001 3.10899 9.54609C3.20487 9.35793 3.35785 9.20495 3.54601 9.10908C3.75992 9.00009 4.03995 9.00009 4.6 9.00009Z"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                  ) : (
                     <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           d="M16.0004 9.00009C16.6281 9.83575 17 10.8745 17 12.0001C17 13.1257 16.6281 14.1644 16.0004 15.0001M18 5.29177C19.8412 6.93973 21 9.33459 21 12.0001C21 14.6656 19.8412 17.0604 18 18.7084M4.6 9.00009H5.5012C6.05213 9.00009 6.32759 9.00009 6.58285 8.93141C6.80903 8.87056 7.02275 8.77046 7.21429 8.63566C7.43047 8.48353 7.60681 8.27191 7.95951 7.84868L10.5854 4.69758C11.0211 4.17476 11.2389 3.91335 11.4292 3.88614C11.594 3.86258 11.7597 3.92258 11.8712 4.04617C12 4.18889 12 4.52917 12 5.20973V18.7904C12 19.471 12 19.8113 11.8712 19.954C11.7597 20.0776 11.594 20.1376 11.4292 20.114C11.239 20.0868 11.0211 19.8254 10.5854 19.3026L7.95951 16.1515C7.60681 15.7283 7.43047 15.5166 7.21429 15.3645C7.02275 15.2297 6.80903 15.1296 6.58285 15.0688C6.32759 15.0001 6.05213 15.0001 5.5012 15.0001H4.6C4.03995 15.0001 3.75992 15.0001 3.54601 14.8911C3.35785 14.7952 3.20487 14.6422 3.10899 14.4541C3 14.2402 3 13.9601 3 13.4001V10.6001C3 10.04 3 9.76001 3.10899 9.54609C3.20487 9.35793 3.35785 9.20495 3.54601 9.10908C3.75992 9.00009 4.03995 9.00009 4.6 9.00009Z"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                  )}
               </button>
               {!isMobile ? (
                  <>
                     <p className="bg-orange text-black text-4xl p-2 text-center font-bold">
                        {getTime()}
                     </p>
                     <p className="">{currentRound}&nbsp;Round</p>
                     <p className="">{currentPick}&nbsp;Pick</p>
                     <p className="">{currentPick}&nbsp;Overall</p>
                     {yourTurn ? (
                        <p className="text-xl font-bold">Draft now!</p>
                     ) : (
                        <div className="p-2 bg-paper-dark dark:bg-gray-primary">
                           <p className="text-xl">{`Your turn in ${userPick}`}</p>
                        </div>
                     )}
                  </>
               ) : (
                  <div className="flex flex-row items-center h-full">
                     <div className="flex items-center justify-center mr-2 text-xl w-[100px] bg-orange min-h-full">
                        <p className="p-2 text-2xl">{getTime()}</p>
                     </div>
                     <div className="flex flex-col py-2">
                        <p className="">{currentRound}&nbsp;Round</p>
                        <p className="">{currentPick}&nbsp;Pick</p>
                        <p className="">{currentPick}&nbsp;Overall</p>
                     </div>
                     {yourTurn ? (
                        <p className="bg-fuscia flex items-center h-full ml-auto align-middle p-2 text-xl font-bold">
                           Draft now!
                        </p>
                     ) : (
                        <p className="self-end ml-auto pr-2 pb-1 text-lg">
                           {`${userPick} pick${
                              userPick === 1 ? '' : 's'
                           } until your turn`}
                        </p>
                     )}
                  </div>
               )}
            </>
         ) : (
            <h2 className="text-xl text-center my-auto">Draft Completed</h2>
         )}
      </div>
   );
};

export default NewTimer;
