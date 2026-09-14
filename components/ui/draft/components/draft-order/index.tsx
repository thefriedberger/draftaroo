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
   const gridCols = `grid-cols-${teams.length}`;

   return picks.length > 0 ? (
      <div className={classNames('overflow-y-scroll h-full relative max-h-64')}>
         <div
            className={classNames(
               gridCols,
               'w-full sticky top-0 grid gap-1 z-10 dark:bg-gray-dark'
            )}
         >
            {picks
               .filter((pick) => pick.draftPosition <= teams.length)
               .map((pick) => (
                  <div className="flex items-end text-white rounded-md z-100 text-ellipsis whitespace-nowrap overflow-hidden">
                     {pick.username}
                     <span></span>
                  </div>
               ))}
         </div>
         <div
            className={classNames(
               gridCols,
               'overflow-y-scroll grid gap-2 h-full relative max-h-48'
            )}
         >
            {picks?.map((pick: Pick, index: number) => {
               return (
                  <div key={index}>
                     <DraftTile
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
                  </div>
               );
            })}
         </div>
      </div>
   ) : (
      <DraftOrderSkeleton />
   );
};

export default DraftOrder;
