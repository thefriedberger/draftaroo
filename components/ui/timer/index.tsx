'use client';

import { DraftPick, TimerProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createRef, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export enum TIMER_STATUS {
   START = 'start',
   STOP = 'stop',
   RESET = 'reset',
}

const OldTimer = ({
   owner,
   currentPick,
   doStart,
   doReset,
   setDoReset,
   currentRound,
   isActive,
   autopick,
   yourTurn,
   turnOrder,
   userTeam,
   isCompleted,
}: TimerProps) => {
   const TIMER_DURATION = 120;
   const [status, setStatus] = useState<TIMER_STATUS>(TIMER_STATUS.STOP);
   const [timer, setTimer] = useState<number>(TIMER_DURATION);
   const timerRef = useRef<any>();
   const [userPick, setUserPick] = useState<number>();
   const chime = createRef<HTMLAudioElement>();
   const [doMute, setDoMute] = useState<boolean>(false);
   const supabase = createClientComponentClient<Database>();

   const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });

   const timerChannelA = supabase.channel('timer-channel');
   const timerChannelB = supabase.channel('timer-channel');
   const timerChannelC = supabase.channel('timer-channel');

   const twoDigits = (num: number) =>
      new Date(num * 1000).toISOString().substring(14, 19);
   const handleStart = () => {
      timerRef.current = setInterval(() => {
         setTimer((timer) => timer - 1);
      }, 1000);
   };

   useEffect(() => {
      if (turnOrder.length && userTeam?.id) {
         const picks = turnOrder.filter(
            (turn: DraftPick) => turn.team_id === userTeam.id
         )[0];
         for (const pick in picks.picks) {
            if (pick === currentPick) {
               setUserPick(0);
               break;
            }
            if (pick > currentPick) {
               setUserPick(Math.abs(Number(currentPick) - Number(pick)));
               break;
            }
         }
      }
   }, [turnOrder, userTeam, currentPick]);

   useEffect(() => {
      if (status === TIMER_STATUS.START && owner) handleStart();
      if (status === TIMER_STATUS.STOP) handleStop();
      if (status === TIMER_STATUS.RESET) handleReset();
      return () => {
         clearInterval(timerRef.current);
      };
   }, [status, isActive, owner]);

   useEffect(() => {
      if (owner && timer === 0) {
         setStatus(TIMER_STATUS.STOP);
         autopick();
      }
   }, [timer, owner]);

   const handleStop = () => {
      clearInterval(timerRef.current);
   };

   const handleReset = () => {
      clearInterval(timerRef.current);
      setTimer(TIMER_DURATION);
      setTimeout(() => {
         setStatus(TIMER_STATUS.START);
      }, 1000);
   };
   useEffect(() => {
      doStart && setStatus(TIMER_STATUS.START);
   }, [doStart]);

   useEffect(() => {
      doReset && setStatus(TIMER_STATUS.RESET);
   }, [doReset]);

   useEffect(() => {
      timerChannelA
         .on('broadcast', { event: 'timer' }, (payload) => {
            if (payload && !owner) {
               payload.payload.message && setTimer(payload.payload.message);
            }
         })
         .on('broadcast', { event: 'status' }, (payload) => {
            if (payload) {
               payload.payload.status && setStatus(payload.payload.status);
            }
         });
   }, [timerChannelA]);

   useEffect(() => {
      if (owner)
         timerChannelB.subscribe((channelStatus) => {
            if (channelStatus === 'SUBSCRIBED') {
               timerChannelB.send({
                  type: 'broadcast',
                  event: 'timer',
                  payload: { message: timer },
               });
            }
         });
   }, [timer, timerChannelB, owner]);

   useEffect(() => {
      timerChannelC.subscribe((channelStatus) => {
         if (channelStatus === 'SUBSCRIBED') {
            if (status === TIMER_STATUS.START) {
               timerChannelC.send({
                  type: 'broadcast',
                  event: 'status',
                  payload: { status: TIMER_STATUS.START },
               });
            }
            if (status === TIMER_STATUS.STOP) {
               timerChannelC.send({
                  type: 'broadcast',
                  event: 'status',
                  payload: { status: TIMER_STATUS.STOP },
               });
            }
            if (status === TIMER_STATUS.RESET) {
               timerChannelC.send({
                  type: 'broadcast',
                  event: 'status',
                  payload: { status: TIMER_STATUS.RESET },
               });
            }
         }
      });
   }, [status]);

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
                        {twoDigits(timer)}
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
                        <p className="p-2 text-2xl">{twoDigits(timer)}</p>
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
               {/* <div className="">
            {owner && (
               <div className="flex flex-col items-start">
                  <button
                     onClick={() => setStatus(TIMER_STATUS.START)}
                     type="button"
                  >
                     Start Timer
                  </button>
                  <button
                     onClick={() => setStatus(TIMER_STATUS.STOP)}
                     type="button"
                  >
                     Pause Timer
                  </button>
                  <button
                     onClick={() => {
                        setStatus(TIMER_STATUS.RESET);
                     }}
                     type="button"
                  >
                     Reset Timer
                  </button>
               </div>
            )}
         </div> */}
            </>
         ) : (
            <h2 className="text-xl text-center my-auto">Draft Completed</h2>
         )}
      </div>
   );
};

export default OldTimer;
