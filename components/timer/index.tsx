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
}: TimerProps) => {
   const TIMER_DURATION = 120;
   const [pick, setPick] = useState();
   const [round, setRound] = useState();
   const [status, setStatus] = useState<TIMER_STATUS>(TIMER_STATUS.RESET);
   const [hostTimer, setHostTimer] = useState<number>(TIMER_DURATION);
   const [timer, setTimer] = useState<number>(TIMER_DURATION);
   const timerRef = useRef<any>();
   const [userPick, setUserPick] = useState();
   const supabase = createClientComponentClient<Database>();

   const timerChannel = supabase.channel('timer-channel', {
      config: {
         broadcast: {
            self: true,
         },
      },
   });

   const twoDigits = (num: number) =>
      num === 0
         ? '00:00'
         : new Date(num * 1000).toISOString().substring(14, 19);
   const startTimer = () => {
      timerRef.current = setInterval(() => {
         setHostTimer((hostTimer) => hostTimer - 1);
      }, 1000);
   };

   useEffect(() => {
      if (status === TIMER_STATUS.START) startTimer();
      if (status === TIMER_STATUS.STOP) handleStop();
      if (status === TIMER_STATUS.RESET) handleReset();
      return () => {
         clearInterval(timerRef.current);
      };
   }, [status, isActive]);

   useEffect(() => {
      if (owner && hostTimer === 0) {
         // setStatus(TIMER_STATUS.STOP);
         autopick();
      }
   }, [hostTimer, owner]);

   const handleStop = () => {
      clearInterval(timerRef.current);
   };

   const handleReset = () => {
      setDoReset(false);
      clearInterval(timerRef.current);
      setHostTimer(TIMER_DURATION);
      isActive &&
         setTimeout(() => {
            setStatus(TIMER_STATUS.START);
         }, 500);
   };

   useEffect(() => {
      timerChannel.on('broadcast', { event: 'timer' }, (payload) => {
         if (payload) {
            payload.payload.message && setTimer(payload.payload.message);
            payload.payload.status && setStatus(payload.payload.status);
         }
      });
      doReset &&
         !owner &&
         timerChannel.subscribe((channelStatus) => {
            if (channelStatus === 'SUBSCRIBED') {
               timerChannel.send({
                  type: 'broadcast',
                  event: 'timer',
                  payload: { status: TIMER_STATUS.RESET },
               });
            }
         });

      owner &&
         timerChannel.subscribe((channelStatus) => {
            if (doReset) {
               timerChannel.send({
                  type: 'broadcast',
                  event: 'timer',
                  payload: { status: TIMER_STATUS.RESET },
               });
            }
            if (channelStatus === 'SUBSCRIBED') {
               timerChannel.send({
                  type: 'broadcast',
                  event: 'timer',
                  payload: { message: hostTimer },
               });
            }
         });
   }, [hostTimer, isActive, doReset]);

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
