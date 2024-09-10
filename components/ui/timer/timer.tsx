'use client';

import { MicIcon } from '@/app/assets/images/icons/mic-icon';
import { MutedIcon } from '@/app/assets/images/icons/muted-icon';
import { DraftPick, TimerProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createRef, useEffect, useRef, useState } from 'react';
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

   const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

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
         setDoReset(false);
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
                  {doMute ? <MutedIcon /> : <MicIcon />}
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
            </>
         ) : (
            <h2 className="text-xl text-center my-auto">Draft Completed</h2>
         )}
      </div>
   );
};

export default Timer;
