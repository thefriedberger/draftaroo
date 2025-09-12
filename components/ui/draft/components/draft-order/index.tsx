import DraftOrderSkeleton from '@/components/ui/draft/skeletons/draft-order';
import { DraftOrderProps } from '@/lib/types';
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

   return picks.length > 0 ? (
      <div className="overflow-y-scroll h-full lg:h-[90dvh] lg:border-r lg:border-paper-dark dark:lg:border-gray-300">
         {picks?.map((pick: Pick, index: number) => {
            return (
               <div key={index}>
                  {pick.draftPosition % teams?.length === 1 && (
                     <div
                        className={
                           'bg-emerald-primary text-white dark:text-black p-2'
                        }
                     >
                        Round&nbsp;
                        {pick.draftPosition === 1
                           ? 1
                           : Math.floor(pick.draftPosition / teams.length + 1)}
                     </div>
                  )}
                  <DraftTile
                     pick={pick}
                     currentPick={currentPick}
                     playerSelected={draftedPlayers[pick.playerID || 0]}
                     isYourTurn={isYourTurn}
                  />
               </div>
            );
         })}
      </div>
   ) : (
      <DraftOrderSkeleton />
   );
};

export default DraftOrder;
