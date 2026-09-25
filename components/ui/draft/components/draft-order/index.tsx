import { AutoDraftIcon } from '@/app/assets/images/icons/auto-draft';
import { gridMap } from '@/app/utils/constants';
import DraftOrderSkeleton from '@/components/ui/draft/skeletons/draft-order';
import { DraftOrderProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { useMemo } from 'react';
import DraftTile from '../draft-tile';

export type Pick = {
   playerID?: number;
   username: string;
   playerName?: string;
   draftPosition: number;
   yourPick: boolean;
   isKeeper: boolean;
};
const DraftOrder = ({
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
   autoDraftTeams,
}: DraftOrderProps) => {
   const supabase = createClientComponentClient<Database>();

   const gridCols = gridMap[teams.length];

   // use effects
   const countdown = useMemo(() => {
      const width = (timer / timerDuration) * 100;
      return `${width}%`;
   }, [timer]);

   return picks.length > 0 ? (
      <>
         <div className="flex w-full sticky top-0 z-50">
            <div className="w-4 mr-1">&nbsp;</div>
            <div
               className={classNames(
                  gridCols,
                  'w-full sticky overflow-y-scroll grid gap-2 z-10 rounded-b-md dark:bg-gray-dark min-h-8'
               )}
            >
               {picks
                  .filter((pick) => pick.draftPosition <= teams.length)
                  .map((pick) => (
                     <div
                        key={pick.draftPosition}
                        className={classNames(
                           'block relative dark:text-white rounded-md text-ellipsis whitespace-nowrap overflow-hidden my-0.5'
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
                        {(autoDraftTeams || []).find(
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
         </div>
         <div className="flex w-full overflow-y-scroll max-h-full pt-8">
            <div className="w-4 grid grid-cols-1 gap-2 mr-1">
               {Array.from({ length: numberOfRounds }).map((round, i) => (
                  <div className="dark:bg-gray-light h-24 flex items-center justify-center max-h-24 rounded-md">
                     <p className="dark:text-white break-all max-w-full h-full py-1 flex flex-col leading-none text-center">
                        <span className="text-[10px] block leading-none -mt-[0.1rem]">
                           R
                        </span>
                        <span className="text-[10px] block leading-none -mt-[0.1rem]">
                           o
                        </span>
                        <span className="text-[10px] block leading-none -mt-[0.1rem]">
                           u
                        </span>
                        <span className="text-[10px] block leading-none -mt-[0.1rem]">
                           n
                        </span>
                        <span className="text-[10px] block leading-none -mt-[0.1rem]">
                           d
                        </span>{' '}
                        <span className="block mt-auto break-all text-md max-w-2 -ml-[0.1rem]">
                           {i + 1}
                        </span>
                     </p>
                  </div>
               ))}
            </div>
            <div
               className={classNames(
                  gridCols,
                  'grid gap-2 h-full w-full lg:relative'
               )}
            >
               {picks?.map((pick: Pick) => {
                  return (
                     <DraftTile
                        key={pick.draftPosition}
                        pick={pick}
                        currentPick={currentPick}
                        playerSelected={
                           draftedPlayers[pick.playerID || 0] as DraftSelection
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
         </div>
      </>
   ) : (
      <DraftOrderSkeleton />
   );
};

export default DraftOrder;
