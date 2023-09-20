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
   currentRound,
   isActive,
}: TimerProps) => {
   const TIMER_DURATION = 120;
   const [pick, setPick] = useState();
   const [round, setRound] = useState();
   const [status, setStatus] = useState<TIMER_STATUS>(TIMER_STATUS.STOP);
   const [timer, setTimer] = useState<number>(TIMER_DURATION);
   const timerRef = useRef<any>();
   const [userPick, setUserPick] = useState();
   const supabase = createClientComponentClient<Database>();

   const twoDigits = (num: number) =>
      new Date(num * 1000).toISOString().substring(14, 19);

   const startTimer = () => {
      if (timer === 0) setStatus(TIMER_STATUS.RESET);
      timerRef.current = setInterval(
         () => setTimer((timer) => timer - 1),
         1000
      );
   };

   useEffect(() => {
      if (status === TIMER_STATUS.START) startTimer();
      if (status === TIMER_STATUS.STOP) handleStop();
      if (status === TIMER_STATUS.RESET) handleReset();
      return () => {
         clearInterval(timerRef.current);
      };
   }, [status]);

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
      const timerChannel = supabase.channel('timer-channel', {
         config: {
            broadcast: {
               self: true,
            },
         },
      });
      timerChannel.on('broadcast', { event: 'timer' }, (payload) => {
         if (payload) {
            if (payload.payload.message) {
               setStatus(TIMER_STATUS.START);
            } else {
               setStatus(TIMER_STATUS.RESET);
            }
         }
      });

      timerChannel.subscribe((status) => {
         if (status === 'SUBSCRIBED') {
            timerChannel.send({
               type: 'broadcast',
               event: 'timer',
               payload: { message: doStart },
            });
         }
      });
   }, [doStart]);

   return (
      <div className="">
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
            {/* {yourTurn ? (
               <p>Draft now!</p>
            ) : (
               <p>
                  {`${userPick} pick${
                     userPick === 1 ? '' : 's'
                  } until your turn`}
               </p>
            )} */}
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
