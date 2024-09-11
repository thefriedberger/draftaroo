'use client';

import { MicIcon } from '@/app/assets/images/icons/mic-icon';
import { MutedIcon } from '@/app/assets/images/icons/muted-icon';
import { useWorkerTimeout } from '@/components/worker/worker-timeout';
import { DraftPick } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createRef, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { NewTimerProps } from './new-timer';

export enum TIMER_STATUS {
   START = 'start',
   STOP = 'stop',
   RESET = 'reset',
}
export const twoDigits = (num: number) =>
   new Date(num * 1000).toISOString().substring(14, 19);
const Timer = ({
   draftId,
   owner,
   currentPick,
   currentRound,
   isActive,
   autopick,
   yourTurn,
   turnOrder,
   userTeam,
   isCompleted,
}: NewTimerProps) => {
   const TIMER_DURATION = 120;
   const { setRunning, tick } = useWorkerTimeout();

   const timerValue = useRef<number>(TIMER_DURATION); // tracks current time
   const resetTimer = useRef<boolean>(true); // tracks whether user should broadcast
   const endTime = useRef<number>();
   const [timer, setTimer] = useState<string>(twoDigits(timerValue.current)); // What displays
   var lastTick = useRef(performance.now());

   const [userPick, setUserPick] = useState<number>();

   const chime = createRef<HTMLAudioElement>();
   const [doMute, setDoMute] = useState<boolean>(false);

   const supabase = createClientComponentClient<Database>();

   const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });

   const timerChannel = supabase.channel(`public:draft:id=eq.${draftId}`);

   const timeDown = (value: number) => {
      if (isActive) {
         var t = Number(String(value)) - 1;
         if (t < 0) {
            t = 0;
         }

         timerValue.current = t;
      }
   };

   useEffect(() => {
      //   resetTimer.current = isActive;
   }, [isActive]);

   useEffect(() => {
      setTimer(twoDigits(timerValue.current));
   }, [timerValue]);

   useEffect(() => {
      timerChannel
         .on(
            'postgres_changes',
            {
               event: '*',
               schema: 'public',
               table: 'draft',
               filter: `id=eq.${draftId}`,
            },
            (payload) => {}
         )
         .subscribe();
   }, [timerChannel, resetTimer]);

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

         // run only if timer is running
         if (isActive) {
            if (now - lastTick.current >= 950) {
               if (endTime.current) {
                  const diff = endTime.current - Date.now();
                  if (diff < 0) {
                     setTimer(twoDigits(0));
                     timerValue.current = 0;
                     if (owner) {
                        // autopick();
                     }
                  } else {
                     timeDown(timerValue.current);
                     lastTick.current = now;
                  }
               }
            }
         }
      }
   }, [tick]);

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
                  <div className="flex flex-row items-center h-full">
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

export default Timer;
