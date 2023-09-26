'use client';

import { TimerProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export enum TIMER_STATUS {
   START = 'start',
   STOP = 'stop',
   RESET = 'reset',
}

const Timer = ({
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
}: TimerProps) => {
   const TIMER_DURATION = 120;
   const [status, setStatus] = useState<TIMER_STATUS>(TIMER_STATUS.STOP);
   const [timer, setTimer] = useState<number>(TIMER_DURATION);
   const timerRef = useRef<any>();
   const [userPick, setUserPick] = useState<number>();
   const supabase = createClientComponentClient<Database>();

   const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

   const timerChannel = supabase.channel('timer-channel', {
      config: {
         broadcast: {
            self: true,
         },
      },
   });

   const twoDigits = (num: number) =>
      new Date(num * 1000).toISOString().substring(14, 19);
   const handleStart = () => {
      timerRef.current = setInterval(() => {
         setTimer((timer) => timer - 1);
      }, 1000);
   };

   useEffect(() => {
      if (turnOrder !== undefined && userTeam?.id !== undefined) {
         if (turnOrder[userTeam.id] !== undefined) {
            for (const turn of turnOrder[userTeam.id]) {
               if (turn === currentPick) {
                  setUserPick(0);
                  break;
               }
               if (turn > currentPick) {
                  setUserPick(Math.abs(Number(currentPick) - Number(turn)));
                  break;
               }
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
         setTimeout(() => {
            setDoReset(false);
            setStatus(TIMER_STATUS.RESET);
         }, 500);
      }
   }, [timer, owner]);

   const handleStop = () => {
      clearInterval(timerRef.current);
   };

   const handleReset = () => {
      clearInterval(timerRef.current);
      setTimer(TIMER_DURATION);
      isActive &&
         setTimeout(() => {
            setStatus(TIMER_STATUS.START);
         }, 500);
   };
   useEffect(() => {
      doStart && setStatus(TIMER_STATUS.START);
   }, [doStart]);

   useEffect(() => {
      doReset && setStatus(TIMER_STATUS.RESET);
   }, [doReset]);

   useEffect(() => {
      timerChannel.on('broadcast', { event: 'timer' }, (payload) => {
         if (payload && !owner) {
            payload.payload.message && setTimer(payload.payload.message);
            payload.payload.status && setStatus(payload.payload.status);
         }
      });
      timerChannel.subscribe((channelStatus) => {
         if (channelStatus === 'SUBSCRIBED') {
            if (status === TIMER_STATUS.START) {
               timerChannel.send({
                  type: 'broadcast',
                  event: 'timer',
                  payload: { status: TIMER_STATUS.START, message: timer },
               });
            }
            if (status === TIMER_STATUS.STOP) {
               timerChannel.send({
                  type: 'broadcast',
                  event: 'timer',
                  payload: { status: TIMER_STATUS.STOP, message: timer },
               });
            }
            if (status === TIMER_STATUS.RESET) {
               timerChannel.send({
                  type: 'broadcast',
                  event: 'timer',
                  payload: { status: TIMER_STATUS.RESET, message: timer },
               });
            }
         }
      });
   }, [timer, isActive, doReset, status, timerChannel, owner]);

   return (
      <div className="max-h-[10vh] h-[10vh] lg:min-h-[180px] lg:max-h-[25vh] lg:h-[25vh] lg:overflow-hidden dark:text-white">
         {!isMobile ? (
            <>
               <p className="">{twoDigits(timer)}</p>
               <p className="">{currentRound}&nbsp;Round</p>
               <p className="">{currentPick}&nbsp;Pick</p>
               <p className="">{currentPick}&nbsp;Overall</p>
               {yourTurn ? (
                  <p>Draft now!</p>
               ) : (
                  <p>
                     {`${userPick} pick${
                        userPick === 1 ? '' : 's'
                     } until your turn`}
                  </p>
               )}
            </>
         ) : (
            <div className="flex flex-row items-center h-full">
               <div className="flex items-center justify-center mr-2 text-xl w-[100px] bg-purple min-h-full">
                  <p className="p-2 text-2xl">{twoDigits(timer)}</p>
               </div>
               <div className="flex flex-col py-2">
                  <p className="">{currentRound}&nbsp;Round</p>
                  <p className="">{currentPick}&nbsp;Pick</p>
                  <p className="">{currentPick}&nbsp;Overall</p>
               </div>
               {yourTurn ? (
                  <p>Draft now!</p>
               ) : (
                  <p className="self-end ml-auto pr-2 pb-1 text-lg">
                     {`${userPick} pick${
                        userPick === 1 ? '' : 's'
                     } until your turn`}
                  </p>
               )}
            </div>
         )}
         <div className="">
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
         </div>
      </div>
   );
};

export default Timer;
