import { gridMap } from '@/app/utils/constants';
import DraftOrderSkeleton from '@/components/ui/draft/skeletons/draft-order';
import { DraftOrderProps } from '@/lib/types';
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
}: DraftOrderProps) => {
   const gridCols = gridMap[teams.length];

   const countdown = useMemo(() => {
      const width = (timer / timerDuration) * 100;
      return `${width}%`;
   }, [timer]);

   return picks.length > 0 ? (
      <>
         <div
            className={classNames(
               gridCols,
               'w-full sticky lg:-top-8 grid gap-2 z-50 dark:bg-gray-dark min-h-8'
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
                     <div className="block absolute w-full h-full top-0 left-0 z-50 text-ellipsis whitespace-nowrap overflow-hidden p-0.5">
                        {pick.username}
                     </div>
                     <div
                        style={{
                           width:
                              currentPick % teams.length === pick.draftPosition
                                 ? countdown
                                 : '100%',
                           transition: 'width 1s linear',
                        }}
                        className={classNames(
                           currentPick % teams.length === pick.draftPosition &&
                              'bg-emerald-primary',
                           currentPick % teams.length === pick.draftPosition &&
                              countdown,
                           pick.yourPick &&
                              currentPick % teams.length !==
                                 pick.draftPosition &&
                              'bg-fuscia-primary !transition-none',
                           'absolute w-full h-full top-0 right-0'
                        )}
                     />
                     {/* TODO: add tooltip hover to show full team name */}
                  </div>
               ))}
         </div>
         <div
            className={classNames(
               gridCols,
               'overflow-y-scroll grid gap-2 h-full max-h-48 lg:relative lg:top-8 lg:mt-8'
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
      </>
   ) : (
      <DraftOrderSkeleton />
   );
};

export default DraftOrder;
