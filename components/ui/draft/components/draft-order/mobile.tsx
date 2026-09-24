import { AutoDraftIcon } from '@/app/assets/images/icons/auto-draft';
import DraftOrderSkeleton from '@/components/ui/draft/skeletons/draft-order';
import { DraftOrderProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { useMemo, useRef } from 'react';
import DraftTile from '../draft-tile';

export type Pick = {
   playerID?: number;
   username: string;
   playerName?: string;
   draftPosition: number;
   yourPick: boolean;
   isKeeper: boolean;
};
const DraftOrderMobile = ({
   teams,
   currentPick,
   draftedPlayers,
   isYourTurn,
   turnOrder,
   league,
   players,
   teamID,
   numberOfRounds,
   picks,
   timer,
   timerDuration,
   hash,
   autoDraftTeams,
}: DraftOrderProps) => {
   const supabase = createClientComponentClient<Database>();

   const previousTimer = useRef<number>(timerDuration);

   const countdown = useMemo(() => {
      if (timerDuration <= 60) {
         const width = (timer / timerDuration) * 100;
         return width;
      }
      if (timer % 2 === 0) {
         const width = (timer / timerDuration) * 100;
         previousTimer.current = width;
         return width;
      }

      return previousTimer.current;
   }, [timer]);

   const splitPicks: any[] = [];
   for (let i = 0; i < picks.length; i += teams.length) {
      splitPicks.push(picks.slice(i, i + teams.length));
   }

   return picks.length > 0 ? (
      <>
         <div
            className={classNames(
               hash !== '#draft-order'
                  ? `max-h-56`
                  : 'max-h-[calc(100vh-66px-64px)]',
               'flex flex-col overflow-scroll gap-2 min-w-full h-full items-start w-full'
            )}
         >
            <div
               className={classNames(
                  'w-full gap-2 sticky top-0 flex flex-nowrap z-40 min-w-full min-h-8 h-8 mt-2'
               )}
            >
               {picks
                  .filter((pick) => pick.draftPosition <= teams.length)
                  .map((pick, index) => (
                     <div
                        key={pick.draftPosition}
                        className={classNames(
                           'block relative flex-1 min-w-24 dark:text-white rounded-md text-ellipsis whitespace-nowrap overflow-hidden bg-paper-light shadow-sm dark:bg-gray-dark my-0.5'
                        )}
                     >
                        <div
                           className={classNames(
                              autoDraftTeams.find(
                                 (autoDraftTeam) =>
                                    autoDraftTeam.auto_draft &&
                                    autoDraftTeam.picks.includes(
                                       pick.draftPosition
                                    )
                              ) && 'max-w-[calc(100%-1.75rem)]',
                              'block absolute w-full h-full top-0 left-0 z-50 text-ellipsis whitespace-nowrap overflow-hidden p-0.5'
                           )}
                        >
                           {pick.username}
                        </div>
                        {autoDraftTeams.find(
                           (autoDraftTeam) =>
                              autoDraftTeam.auto_draft &&
                              autoDraftTeam.picks.includes(pick.draftPosition)
                        ) ? (
                           <span
                              className={classNames(
                                 currentPick % teams.length ===
                                    pick.draftPosition % teams.length
                                    ? 'stroke-black dark:stroke-white'
                                    : 'stroke-black dark:stroke-white',
                                 'absolute top-1 right-0 z-[10000] w-7 h-7'
                              )}
                           >
                              <AutoDraftIcon />
                           </span>
                        ) : null}
                        <div
                           style={{
                              width:
                                 currentPick % teams.length ===
                                 pick.draftPosition % teams.length
                                    ? countdown
                                    : '100%',
                              transition: 'width 1s linear',
                           }}
                           className={classNames(
                              currentPick % teams.length ===
                                 pick.draftPosition % teams.length &&
                                 'bg-emerald-primary',
                              pick.yourPick &&
                                 currentPick % teams.length !==
                                    pick.draftPosition % teams.length &&
                                 'bg-fuscia-primary !transition-none',
                              'absolute w-full h-full top-0 right-0'
                           )}
                        />
                        {/* TODO: add tooltip hover to show full team name */}
                     </div>
                  ))}
            </div>
            {splitPicks.map((picks, index) => (
               <div
                  key={index}
                  className={classNames('flex flex-nowrap gap-2 w-full')}
               >
                  {picks?.map((pick: Pick) => {
                     return (
                        <DraftTile
                           className="min-w-24"
                           key={pick.draftPosition}
                           pick={pick}
                           currentPick={currentPick}
                           playerSelected={
                              draftedPlayers[
                                 pick.playerID || 0
                              ] as DraftSelection
                           }
                           player={
                              players.find(
                                 (player) => player.id === pick.playerID
                              ) as Player
                           }
                           isYourTurn={isYourTurn}
                        />
                     );
                  })}
               </div>
            ))}
         </div>
      </>
   ) : (
      <DraftOrderSkeleton />
   );
};

export default DraftOrderMobile;
