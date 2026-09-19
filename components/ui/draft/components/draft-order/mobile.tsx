import DraftOrderSkeleton from '@/components/ui/draft/skeletons/draft-order';
import { DraftOrderProps } from '@/lib/types';
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
}: DraftOrderProps) => {
   const previousTimer = useRef<number>(timerDuration);
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
         <div className="flex flex-col overflow-scroll gap-2 min-w-full h-full">
            <div
               className={classNames(
                  'w-fit gap-2 sticky top-0 flex flex-nowrap z-50 min-w-full dark:bg-gray-dark min-h-8 h-8 mt-2'
               )}
            >
               {picks
                  .filter((pick) => pick.draftPosition <= teams.length)
                  .map((pick) => (
                     <div
                        key={pick.draftPosition}
                        className={classNames(
                           'block relative flex-1 min-w-24 dark:text-white rounded-md text-ellipsis whitespace-nowrap overflow-hidden my-0.5'
                        )}
                     >
                        <div className="block absolute w-full h-full top-0 left-0 z-50 text-ellipsis whitespace-nowrap overflow-hidden p-0.5">
                           {pick.username}
                        </div>
                        <div
                           style={{
                              width:
                                 currentPick % 10 === pick.draftPosition
                                    ? `${countdown}%`
                                    : '100%',
                              transition:
                                 timerDuration > 60
                                    ? 'width 4s linear'
                                    : 'width 1s linear',
                           }}
                           className={classNames(
                              currentPick % 10 === pick.draftPosition &&
                                 'bg-gradient-to-l to-[rgba(230,178,39,1)] from-emerald-primary from-[60%]',
                              pick.yourPick &&
                                 currentPick % 10 !== pick.draftPosition &&
                                 'dark:bg-fuscia-primary',
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
