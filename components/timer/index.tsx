'use client';

import { TimerProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export enum STATUS {
   START = 'Started',
   STOP = 'Stopped',
   RESET = 'Reset',
}

const Timer = ({
   owner,
   currentPick,
   doStart,
   doStop,
   doReset,
   autoPick,
}: TimerProps) => {
   const TIMER_DURATION = 120;
   const [pick, setPick] = useState();
   const [round, setRound] = useState();
   const [status, setStatus] = useState(STATUS.STOP);
   const [hostTimer, setHostTimer] = useState<number>(TIMER_DURATION);
   const [timer, setTimer] = useState<string | number>();
   const [timerInterval, setTimerInterval] = useState<any>();
   const [userPick, setUserPick] = useState();
   const supabase = createClientComponentClient<Database>();

   const twoDigits = (num: number) =>
      new Date(num * 1000).toISOString().substring(14, 19);

   const startTimer = () => {
      if (hostTimer === 0) setHostTimer(TIMER_DURATION);
      if (status === STATUS.START)
         setTimerInterval(
            setInterval(() => setHostTimer((hostTimer) => hostTimer - 1), 1000)
         );
   };

   useEffect(() => {
      startTimer();
      return () => {
         clearInterval;
      };
   }, [status]);

   const handleStart = () => {
      setStatus(STATUS.START);
      const timeout = startTimer();
      setTimerInterval(timeout);
   };

   const handleStop = () => {
      setStatus(STATUS.STOP);
      setTimerInterval(clearInterval(timerInterval));
   };

   const handleReset = () => {
      setStatus(STATUS.RESET);
      setTimerInterval(clearInterval(timerInterval));
      setHostTimer(TIMER_DURATION);
   };

   useEffect(() => {
      const channelC = supabase.channel('timer-channel', {
         config: {
            broadcast: {
               self: true,
            },
         },
      });
      channelC.on('broadcast', { event: 'timer' }, (payload) => {
         if (payload) setTimer(twoDigits(payload.payload.message));
      });

      channelC.subscribe((status) => {
         if (status === 'SUBSCRIBED') {
            channelC.send({
               type: 'broadcast',
               event: 'timer',
               payload: { message: hostTimer },
            });
         }
      });
   }, [hostTimer]);

   return (
      <div className="">
         <div className="text-white">
            <h1 id="timer"></h1>
            <div className="">
               <p>{timer}</p>
               <p>{round}&nbsp;Round</p>
               <p>{pick}&nbsp;Pick</p>
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
                  <button onClick={handleStart} type="button">
                     Start Timer
                  </button>
                  <button onClick={handleStop} type="button">
                     Pause Timer
                  </button>
                  <button onClick={handleReset} type="button">
                     Reset Timer
                  </button>
               </div>
            )}
         </div>
      </div>
   );
};

export default Timer;
