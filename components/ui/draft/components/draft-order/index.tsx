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
   const numberOfPicks = teams.length * numberOfRounds;
   const gridMap = {
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
   };

   const gridCols = gridMap[teams.length];

   const countdown = useMemo(() => {
      console.log(timer / timerDuration);
      const width = (timer / timerDuration) * 100;
      return `${width}%`;
   }, [timer]);

   return picks.length > 0 ? (
      <>
         <div
            className={classNames(
               gridCols,
               'w-full sticky -top-8 grid gap-2 z-50 dark:bg-gray-dark h-8'
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
                              currentPick % 10 === pick.draftPosition
                                 ? countdown
                                 : '100%',
                           transition: 'width 1s linear',
                           background:
                              currentPick % 10 === pick.draftPosition
                                 ? `linear-gradient(-75deg, #059669 40%, rgba(11, 230, 162,.8) 50%, #059669 60%)`
                                 : '',
                           backgroundSize: '300%',
                           backgroundPositionX: '100%',
                           animation:
                              currentPick % 10 === pick.draftPosition
                                 ? 'shimmer 5s infinite linear'
                                 : 'none',
                        }}
                        className={classNames(
                           currentPick % 10 === pick.draftPosition &&
                              'bg-gradient-to-l to-[rgba(230,178,39,1)] from-emerald-primary from-[60%]',
                           currentPick % 10 === pick.draftPosition && countdown,
                           pick.yourPick &&
                              currentPick % 10 !== pick.draftPosition &&
                              'bg-fuscia-primary',
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
               'overflow-y-scroll grid gap-2 h-full max-h-48 relative top-8 mt-8'
            )}
            id={'draft-tiles-container'}
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
