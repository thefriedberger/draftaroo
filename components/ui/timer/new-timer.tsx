'use client';

import { MicIcon } from '@/app/assets/images/icons/mic-icon';
import { MutedIcon } from '@/app/assets/images/icons/muted-icon';
import { getTimerData } from '@/app/utils/helpers';
import { useWorkerTimeout } from '@/components/worker/worker-timeout';
import { DraftPick, TimerProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createRef, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
export interface NewTimerProps extends TimerProps {
   draftId: string;
}

export type DraftTimerFields = { is_active: boolean; end_time?: number };

export const TIMER_DURATION = Number(process.env.NEXT_PUBLIC_TIMER_DURATION); // seconds

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
   isActive,
}: NewTimerProps) => {
   const supabase = createClientComponentClient<Database>();

   const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });
   const { setRunning, tick } = useWorkerTimeout();
   const [isTimerRunning, setIsTimerRunning] = useState(false);
   var lastTick = useRef(performance.now());
   const [roomData, setRoomData] = useState<DraftTimerFields>({
      is_active: false,
   });
   var timerValue = useRef(TIMER_DURATION);
   const [timer, setTimer] = useState<string>(formatTime(TIMER_DURATION));
   const [userPick, setUserPick] = useState<number>();
   const [doMute, setDoMute] = useState<boolean>(false);
   const chime = createRef<HTMLAudioElement>();

   // use effects
   useEffect(() => {
      subscribeToTimerRoom(draftId, onChange);
      getData();
   }, [draftId]);

   useEffect(() => {
      if (roomData.is_active) {
         const end = roomData.end_time;
         if (end) {
            const now = Date.now();
            const diff = end - now;
            setIsTimerRunning(true);
            // if (diff < 0) {
            //    setTimer(formatTime(0));
            //    timerValue.current = 0;
            // } else {
            const finalTimer = Math.ceil(diff / 1000);

            lastTick.current = performance.now();

            timerValue.current = finalTimer;
            setTimer(formatTime(finalTimer));
            setRunning(true);
            // }
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
      }
   }, [turnOrder, userTeam, currentPick]);

   useEffect(() => {
      if (tick > 0) {
         const now = performance.now();

         if (isTimerRunning) {
            if (now - lastTick.current >= 950) {
               if (roomData.end_time) {
                  const end = roomData.end_time;
                  const diff = end - Date.now();
                  if (diff < 0) {
                     setTimer(formatTime(0));
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

   useEffect(() => {
      if (timer === '00:00' && owner) {
         autopick();
      }
   }, [timer]);

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
         .subscribe();

      return timerTrack;
   };

   const onChange = (payload: DraftTimerFields) => {
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

   const timeDown = (value: number) => {
      if (isTimerRunning) {
         var t = Number(String(value)) - 1;
         if (t < 0) {
            t = 0;
         }
         timerValue.current = t;
         setTimer(formatTime(t));
      }
   };

   function formatTime(t: number) {
      var finalTime =
         ('0' + (Math.floor(t / 60) % 60)).slice(-2) +
         ':' +
         ('0' + (t % 60)).slice(-2);
      if (
         new Date(TIMER_DURATION * 1000).toISOString().substring(14, 19) <
         finalTime
      ) {
         return new Date(TIMER_DURATION * 1000).toISOString().substring(14, 19);
      }
      return finalTime;
   }
   return (
      <div className="flex flex-col justify-between w-full h-[10dvh] lg:min-h-[180px] lg:h-[180px] lg:overflow-hidden dark:text-white relative">
         {!isCompleted ? (
            <>
               {yourTurn && isActive && (
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
                  <span className="sr-only">Mute draft chime</span>
                  {doMute ? <MutedIcon /> : <MicIcon />}
               </button>
               {!isMobile ? (
                  <>
                     <p className="bg-orange text-black text-4xl p-2 text-center font-bold">
                        {timer}
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
                  <div className="bg-paper-primary dark:bg-gray-primary flex flex-row items-center h-full">
                     <div className="flex items-center justify-center mr-2 text-xl w-[100px] bg-orange min-h-full">
                        <p className="p-2 text-2xl">{timer}</p>
                     </div>
                     <div className="flex flex-col py-2">
                        <p className="">{currentRound}&nbsp;Round</p>
                        <p className="">{currentPick}&nbsp;Pick</p>
                        <p className="">{currentPick}&nbsp;Overall</p>
                     </div>
                     {yourTurn ? (
                        <p className="bg-fuscia-primary flex items-center h-full ml-auto align-middle p-2 text-xl font-bold">
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
