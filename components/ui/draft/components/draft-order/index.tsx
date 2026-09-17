import DraftOrderSkeleton from '@/components/ui/draft/skeletons/draft-order';
import { DraftOrderProps } from '@/lib/types';
import classNames from 'classnames';
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
}: DraftOrderProps) => {
   const numberOfPicks = teams.length * numberOfRounds;
   const gridMap = {
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
   };

   const gridCols = gridMap[teams.length];

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
                        'block text-white rounded-md text-ellipsis whitespace-nowrap overflow-hidden my-0.5 p-0.5',
                        currentPick % 10 === pick.draftPosition &&
                           'bg-emerald-primary',
                        pick.yourPick && 'dark:bg-fuscia-primary'
                     )}
                  >
                     {pick.username}
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
