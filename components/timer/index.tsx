'use client';

import { TimerProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useRef, useState } from 'react';

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
         turnOrder[userTeam.id] !== undefined &&
            setUserPick(
               Math.abs(Number(currentPick) - turnOrder[userTeam.id][0])
            );
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
      <div className="max-h-[25vh] h-[25vh] overflow-hidden">
         <div className="dark:text-white">
            <h1 id="timer"></h1>
            <div className="">
               <p>{twoDigits(timer)}</p>
               <p>{currentRound}&nbsp;Round</p>
               <p>{currentPick}&nbsp;Pick</p>
               <p>{currentPick}&nbsp;Overall</p>
            </div>
         </div>
         <div className="">
            {yourTurn ? (
               <p>Draft now!</p>
            ) : (
               <p>
                  {`${userPick} pick${
                     userPick === 1 ? '' : 's'
                  } until your turn`}
               </p>
            )}
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
