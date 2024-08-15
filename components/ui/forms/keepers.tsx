'use client';

import { RosterPlayer } from '@/app/leagues/tabs/keepers';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChangeEvent, useState } from 'react';

export interface KeeperFormProps {
   team: Team;
   picks: number[];
   roster: RosterPlayer[];
   players: Player[];
   numberOfRounds: number;
   draft: Draft;
}
const KeeperForm = ({
   team,
   picks,
   roster,
   players,
   numberOfRounds,
   draft,
}: KeeperFormProps) => {
   const supabase = createClientComponentClient<Database>();
   const [picksAvailable, setPicksAvailable] = useState<number[]>(picks);
   const [rosterState, setRosterState] = useState<RosterPlayer[]>(roster);

   const findClosestPick = (picks: number[]) => {
      const tempPicks: number[] = [];
      return picks
         .sort((a, b) => b - a)
         .map((pick) => {
            let closestPick = picksAvailable
               .filter((pick) => !tempPicks.includes(pick))
               .sort((a, b) => b - a)
               .reduce((prev, curr) => {
                  return Math.abs(curr - pick) < Math.abs(prev - pick)
                     ? curr
                     : prev;
               }, 0);
            if (tempPicks.includes(closestPick)) {
               closestPick--;
            }
            if (closestPick <= 0) return 0;

            tempPicks.push(closestPick);
            return closestPick;
         });
   };
   const handleSetKeeper = (
      { target }: ChangeEvent<HTMLInputElement>,
      player: RosterPlayer
   ) => {
      const { picks_needed, picks_used } = player;
      if (target.checked) {
         const tempPicks: number[] = [];
         const picks: number[] = findClosestPick(picks_needed).sort(
            (a, b) => a - b
         );
         setPicksAvailable(
            picksAvailable.filter((pick) => !picks.includes(pick))
         );
         setRosterState(
            rosterState.map((rosterPlayer) => {
               if (rosterPlayer.player_id === player.player_id) {
                  return {
                     ...rosterPlayer,
                     picks_used: picks,
                     is_keeper: !rosterPlayer.is_keeper,
                  };
               }
               return { ...rosterPlayer };
            })
         );
      }
      if (!target.checked) {
         setPicksAvailable([...picksAvailable, ...picks_used]);
         setRosterState(
            rosterState.map((rosterPlayer) => {
               if (rosterPlayer.player_id === player.player_id) {
                  return {
                     ...rosterPlayer,
                     picks_used: [],
                     is_keeper: !rosterPlayer.is_keeper,
                  };
               }
               return { ...rosterPlayer };
            })
         );
      }
   };

   return (
      <form className={'flex flex-col mt-2'}>
         <table>
            <thead className="bg-emerald-primary">
               <tr className={'align-bottom '}>
                  <th className={'w-[40px] p-2'}>Keep Player?</th>
                  <th className={'w-[40px] p-2'}>Pos</th>
                  <th className="p-2">Player</th>
                  <th className="w-[20px] p-2">Round Drafted</th>
                  <th className="p-2">Pick(s) Used</th>
               </tr>
            </thead>
            <tbody>
               {rosterState
                  .sort(
                     (a, b) =>
                        (a?.draft_position ?? numberOfRounds + 1) -
                        (b?.draft_position ?? numberOfRounds + 1)
                  )
                  .map((player: RosterPlayer, index: number) => {
                     const playerData: Player | any = players.filter(
                        (playerToMatch) => playerToMatch.id === player.player_id
                     );
                     const closestPick = findClosestPick(player.picks_needed);
                     const canKeep =
                        player.picks_needed.length > 1 &&
                        player.picks_needed.some(
                           (pick) => !picksAvailable.includes(pick)
                        );

                     return (
                        <tr key={player.player_id}>
                           <td className="p-2">
                              <input
                                 className={'w-[40px] h-[20px] align-middle'}
                                 type="checkbox"
                                 defaultChecked={player.is_keeper ?? false}
                                 disabled={
                                    (closestPick.length === 0 ||
                                       closestPick[closestPick.length - 1] ===
                                          0 ||
                                       canKeep) &&
                                    !player.is_keeper
                                 }
                                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleSetKeeper(e, player)
                                 }
                              />
                           </td>
                           <td className={'w-[40px] p-2'}>
                              {playerData[0].primary_position}
                           </td>
                           <td className="p-2">
                              {playerData[0].first_name}{' '}
                              {playerData[0].last_name}
                           </td>
                           <td className="p-2">
                              {player.draft_position ?? 'FA'}
                           </td>
                           <td className="p-2">
                              <select
                                 className="text-black"
                                 value={
                                    player.is_keeper && player.picks_used?.[0]
                                       ? player.picks_used[0]
                                       : closestPick[0]
                                 }
                                 disabled={true}
                              >
                                 {picks
                                    .filter((pick) => {
                                       if (!player.draft_position) return pick;
                                       return player.draft_position === 1
                                          ? player.draft_position === pick
                                          : player.draft_position - 1 >= pick;
                                    })
                                    .map((pick) => {
                                       return (
                                          <option
                                             key={`${player.player_id}${pick}`}
                                          >
                                             {player?.picks_used?.length > 1
                                                ? player.picks_used.map(
                                                     (pickUsed, index) => {
                                                        if (
                                                           index ===
                                                           player.picks_used
                                                              .length -
                                                              1
                                                        ) {
                                                           return pickUsed;
                                                        } else if (
                                                           player.picks_needed
                                                              .length ===
                                                              numberOfRounds &&
                                                           index === 0
                                                        ) {
                                                           return `${pickUsed}-`;
                                                        } else if (
                                                           index === 0
                                                        ) {
                                                           return `${pickUsed}, `;
                                                        } else if (
                                                           index === 1 &&
                                                           player.picks_needed
                                                              .length !==
                                                              numberOfRounds
                                                        ) {
                                                           return `${pickUsed}-`;
                                                        }
                                                        return;
                                                     }
                                                  )
                                                : pick}
                                          </option>
                                       );
                                    })}
                              </select>
                           </td>
                        </tr>
                     );
                  })}
            </tbody>
         </table>
         <button
            className={
               'appearance-none border-0 bg-emerald-primary picked-md w-fit mx-auto p-2 mt-2'
            }
            type="submit"
         >
            Submit Keepers
         </button>
      </form>
   );
};

export default KeeperForm;
