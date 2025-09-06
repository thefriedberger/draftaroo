import DraftOrderSkeleton from '@/components/ui/draft/skeletons/draft-order';
import { DraftOrderProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
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
}: DraftOrderProps) => {
   const [picks, setPicks] = useState<Pick[]>([]);
   const numberOfPicks = teams.length * numberOfRounds;

   const supabase = createClientComponentClient<Database>();

   const populatePicks = () => {
      const tempPicksArray: Pick[] = [];
      for (let j = 1; j <= numberOfPicks; j++) {
         const draftPosition = j;
         const pick: Pick = {
            draftPosition: draftPosition,
            username: '',
            yourPick: false,
            isKeeper: false,
         };
         for (const draftedPlayer of draftedPlayers) {
            if (pick.draftPosition === draftedPlayer.pick) {
               const player = players.find(
                  (p) => p.id === draftedPlayer.player_id
               );
               pick.playerID = draftedPlayer.player_id;
               pick.isKeeper = draftedPlayer.is_keeper;
               pick.playerName = `${player?.first_name.charAt(0)}. ${
                  player?.last_name
               }`;
               break;
            }
         }
         for (const turn of turnOrder) {
            if (turn.picks.includes(draftPosition)) {
               pick.username = teams.filter((team: Team) => {
                  return team.id === turn.team_id;
               })?.[0]?.team_name;
               if (turn.team_id === teamID) {
                  pick.yourPick = true;
               }
            }
         }
         tempPicksArray.push(pick);
      }
      setPicks(tempPicksArray);
   };

   useEffect(() => {
      if (teams.length > 0 && turnOrder.length) {
         populatePicks();
      }
   }, [teams, numberOfRounds, turnOrder]);

   const updateDraftedPlayers = () => {
      const tempPicks: Pick[] = picks.map((pick) => {
         let foundPlayer;
         for (const draftedPlayer of draftedPlayers) {
            if (pick.draftPosition === draftedPlayer.pick) {
               const player = players.find(
                  (p) => p.id === draftedPlayer.player_id
               );
               foundPlayer = {
                  draftPosition: draftedPlayer.pick,
                  playerID: draftedPlayer.player_id,
                  username: pick.username,
                  yourPick: pick.yourPick,
                  isKeeper: draftedPlayer.is_keeper,
                  playerName: `${player?.first_name.charAt(0)}. ${
                     player?.last_name
                  }`,
               };
               break;
            }
         }
         if (foundPlayer?.playerID) {
            return {
               ...foundPlayer,
            };
         }
         return pick;
      });
      return tempPicks;
   };
   useEffect(() => {
      picks.length > 0 && setPicks(updateDraftedPlayers());
   }, [draftedPlayers]);

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
