'use client';

import { AutoDraftIcon } from '@/app/assets/images/icons/auto-draft';
import { MicIcon } from '@/app/assets/images/icons/mic-icon';
import { MutedIcon } from '@/app/assets/images/icons/muted-icon';
import { supabaseStorage } from '@/app/utils/constants';
import getTime from '@/app/utils/get-time';
import {
   fetchAutoDraftStatusByTeam,
   getTimerData,
   setAutoDraftStatusByTeam,
} from '@/app/utils/helpers';
import { DraftContext } from '@/components/context/draft-context';
import { buttonClasses } from '@/components/ui/helpers/buttons';
import { useWorkerTimeout } from '@/components/worker/worker-timeout';
import { DraftPick, TimerProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { createRef, useContext, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Pick } from '../draft-order';

export type DraftTimerFields = { is_active: boolean; end_time?: number };
export type DraftPicksFields = {
   auto_draft: boolean;
   picks: number[];
   created_at: string;
   draft_id: string;
   id: string;
   team_id: string;
};

const Timer = ({
   draftId,
   yourTurn,
   currentPick,
   currentRound,
   isCompleted,
   turnOrder,
   userTeam,
   userPicks,
   autopick,
   owner,
   isActive,
   timerDuration,
   pickIsKeeper,
   autoDraftTeams,
}: TimerProps) => {
   const supabase = createClientComponentClient<Database>();

   const { updateTimer } = useContext(DraftContext);

   const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });
   const { setRunning, tick } = useWorkerTimeout();
   const [isTimerRunning, setIsTimerRunning] = useState(false);
   var lastTick = useRef(performance.now());
   const [roomData, setRoomData] = useState<DraftTimerFields>({
      is_active: false,
   });
   var timerValue = useRef(timerDuration);
   const [timer, setTimer] = useState<string>(formatTime(timerDuration));
   const [time, setTime] = useState<number>(timerDuration);
   const [userPick, setUserPick] = useState<number>();
   const [doMute, setDoMute] = useState<boolean>(false);
   const filteredPicks = useRef<Pick[]>();
   const [picksRemaining, setPicksRemaining] = useState<string>('');
   const chime = createRef<HTMLAudioElement>();
   const serverTime = useRef<number>(Date.now());

   const timerTrack = supabase.channel(`public:draft:id=eq.${draftId}`);
   const draftPicks = supabase.channel(
      `public:draft_picks:draft_id=eq.${draftId}`
   );

   const [shouldAutoDraft, setShouldAutoDraft] = useState<boolean>();

   // use effects
   useEffect(() => {
      subscribeToTimerRoom(draftId, onTimerChange);
      getData();
   }, []);

   useEffect(() => {
      const getAutoDraftStatus = async () => {
         setShouldAutoDraft(
            await fetchAutoDraftStatusByTeam(supabase, userTeam.id, draftId)
         );
      };
      if (userTeam) {
         getAutoDraftStatus();
      }
   }, [userTeam, draftId]);

   useEffect(() => {
      const setUserPicks = () => {
         const total = userPicks.filter((pick) => pick.yourPick).length;
         let remaining = userPicks.filter(
            (pick) => pick.yourPick && !pick.playerID
         ).length;

         for (const pick of userPicks) {
            if (!pick.yourPick) continue;
         }

         setPicksRemaining(`${remaining}/${total}`);
      };

      setUserPicks();
   }, [userPicks]);

   useEffect(() => {
      const updateServerTime = async () => {
         serverTime.current = await getTime();
      };
      if (roomData.is_active) {
         const end = roomData.end_time;
         if (end) {
            updateServerTime().then(() => {
               const now = serverTime.current;
               const diff = end - now;
               setIsTimerRunning(true);
               const finalTimer = Math.ceil(diff / 1000);

               lastTick.current = performance.now();

               timerValue.current = finalTimer;
               setTimer(formatTime(finalTimer));
               updateTimer?.(finalTimer);
               setRunning(true);
            });
         }
      } else {
         setRunning(false);
         setIsTimerRunning(false);
      }
   }, [roomData]);

   useEffect(() => {
      if (turnOrder.length && userTeam?.id) {
         turnOrder
            .filter((turn: DraftPick) => turn.team_id === userTeam.id)[0]
            .picks.some((pick: number) => Number(currentPick) <= pick) &&
            setUserPick(
               Math.abs(
                  Number(currentPick) -
                     (turnOrder
                        .filter(
                           (turn: DraftPick) => turn.team_id === userTeam.id
                        )[0]
                        .picks.find(
                           (pick: number) => Number(currentPick) <= pick
                        ) ?? 0)
               )
            );
      }
   }, [userTeam, currentPick]);

   useEffect(() => {
      if (tick > 0) {
         const now = performance.now();
         if (isTimerRunning) {
            if (now - lastTick.current >= 950) {
               if (roomData.end_time) {
                  const end = roomData.end_time;
                  const diff = end - now;
                  if (diff < 0) {
                     updateTimer?.(0);
                     setTimer(formatTime(0));
                     setTime(diff);
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
      if (owner) {
         if (
            isActive &&
            autoDraftTeams.some(
               (team) =>
                  team.auto_draft && team.picks.includes(currentPick as number)
            ) &&
            timer <= formatTime(timerDuration - 5)
         ) {
            autopick();
         }

         if (time < -2) {
            autopick();
         }
      }
   }, [timer, time]);

   useEffect(() => {
      if (isCompleted) supabase.removeChannel(timerTrack);
   }, [isCompleted]);

   useEffect(() => {
      (async () => {
         const { data, error } = await supabase
            .from('draft_picks')
            .update({ auto_draft: shouldAutoDraft })
            .eq('team_id', userTeam.id)
            .eq('draft_id', draftId);
      })();
   }, [shouldAutoDraft]);

   // end of use effects

   const handleAutoDraft = () => {
      setAutoDraftStatusByTeam(
         supabase,
         userTeam.id,
         draftId,
         !shouldAutoDraft
      );
      setShouldAutoDraft(!shouldAutoDraft);
   };

   const subscribeToTimerRoom = (
      draftId: string,
      changeCallback: (payload: any) => void
   ) => {
      timerTrack
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

   const onTimerChange = (payload: DraftTimerFields) => {
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
         setTime(t);
         if (t < 0) {
            t = 0;
         }
         timerValue.current = t;
         updateTimer?.(t);
         setTimer(formatTime(t));
      }
   };

   function formatTime(t: number) {
      var finalTime =
         ('0' + (Math.floor(t / 60) % 60)).slice(-2) +
         ':' +
         ('0' + (t % 60)).slice(-2);
      if (
         new Date(timerDuration * 1000).toISOString().substring(14, 19) <
         finalTime
      ) {
         return new Date(timerDuration * 1000).toISOString().substring(14, 19);
      }
      return finalTime;
   }

   useEffect(() => {
      if (chime.current && !doMute && yourTurn && !pickIsKeeper) {
         chime.current.play().catch((error) => {
            console.log('Autoplay was blocked by the browser:', error);
         });
      }
   }, [doMute, yourTurn, pickIsKeeper]);

   return (
      <div className="flex flex-col justify-between w-full h-full lg:overflow-hidden dark:text-white relative lg:border-b lg:border-gray-light ">
         {!isCompleted ? (
            <>
               <audio ref={chime} controls={false} muted={doMute}>
                  <source src={supabaseStorage['Chime']} type="audio/mp3" />
               </audio>
               <button
                  type="button"
                  title={`${doMute ? 'Unmute' : 'Mute'} draft chime`}
                  className={
                     'hidden lg:block w-[20px] stroke-black dark:stroke-white dark:lg:stroke-black absolute top-1 left-1 lg:left-auto lg:right-1 z-10'
                  }
                  onClick={() => setDoMute(!doMute)}
               >
                  <span className="sr-only">
                     {doMute ? 'Unmute' : 'Mute'} draft chime
                  </span>
                  {doMute ? <MutedIcon /> : <MicIcon />}
               </button>
               {!isMobile ? (
                  <>
                     <div className="bg-orange-primary flex items-center justify-center">
                        <p className=" text-black text-4xl p-2 text-center font-bold">
                           {timer}
                        </p>{' '}
                        <button
                           title={`${
                              shouldAutoDraft ? 'Disable' : 'Enable'
                           } autodraft`}
                           type="button"
                           onClick={handleAutoDraft}
                           className={classNames(
                              buttonClasses,
                              '!py-1 !px-1 rounded-md flex justify-center items-center stroke-black dark:!stroke-white dark:lg:stroke-black absolute right-1 top-7 w-6 h-6'
                           )}
                        >
                           <span className="sr-only">
                              {shouldAutoDraft ? 'Disable' : 'Enable'} autodraft
                           </span>
                           {<AutoDraftIcon active={shouldAutoDraft} />}
                        </button>
                     </div>
                     <div
                        className={classNames(
                           yourTurn
                              ? 'bg-fuscia-dark'
                              : 'bg-paper-dark dark:bg-gray-primary',
                           'p-2 flex justify-center'
                        )}
                     >
                        <p className="text-md leading-none">
                           {yourTurn
                              ? pickIsKeeper
                                 ? '✨🎉✨'
                                 : 'Draft now!'
                              : userPick
                              ? `Your turn in ${userPick} ${
                                   userPick === 1 ? 'pick' : 'picks'
                                }`
                              : 'No more picks'}
                        </p>
                     </div>
                  </>
               ) : (
                  <div className="bg-paper-primary h-16 dark:bg-gray-primary flex flex-row items-center">
                     <div className="flex items-center justify-center mr-2 w-1/2 bg-orange-primary min-h-full">
                        <p className="ml-4 text-4xl leading-none">{timer}</p>
                     </div>
                     <div
                        className={classNames(
                           yourTurn && 'bg-fuscia-primary',
                           'flex flex-col items-center h-full ml-auto align-middle p-2 text-xl'
                        )}
                     >
                        <div className="flex w-full justify-end">
                           <button
                              title={`${
                                 shouldAutoDraft ? 'Disable' : 'Enable'
                              } autodraft`}
                              type="button"
                              onClick={handleAutoDraft}
                              className={classNames(
                                 buttonClasses,
                                 'w-[30px] !py-1 !px-1 rounded-md flex items-center stroke-black dark:!stroke-white dark:lg:!stroke-black outline outline-1 outline-gray-light'
                              )}
                           >
                              <span className="sr-only">
                                 {shouldAutoDraft ? 'Disable' : 'Enable'}{' '}
                                 autodraft
                              </span>
                              {<AutoDraftIcon active={shouldAutoDraft} />}
                           </button>

                           <button
                              type="button"
                              title={`${
                                 doMute ? 'Unmute' : 'Mute'
                              } draft chime`}
                              className={classNames(
                                 'no-underline bg-paper-button hover:bg-paper-dark dark:bg-gray-primary dark:hover:bg-gray-light dark:text-white text-sm ml-2 px-1 rounded-md items-center stroke-black dark:!stroke-white dark:lg:!stroke-black outline outline-1 outline-gray-light block lg:hidden w-[30px]'
                              )}
                              onClick={() => setDoMute(!doMute)}
                           >
                              <span className="sr-only">
                                 {doMute ? 'Unmute' : 'Mute'} draft chime
                              </span>
                              {doMute ? <MutedIcon /> : <MicIcon />}
                           </button>
                        </div>
                        <p className="text-center w-full">
                           {yourTurn
                              ? pickIsKeeper
                                 ? '✨🎉✨'
                                 : 'Draft now!'
                              : userPick
                              ? `Your turn in ${userPick}`
                              : 'No more picks'}
                        </p>
                     </div>
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
