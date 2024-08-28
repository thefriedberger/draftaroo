'use client';

import { RosterPlayer } from '@/app/leagues/tabs/keepers';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

export interface KeeperFormProps {
   team: Team;
   userPicks: number[];
   roster: RosterPlayer[];
   players: Player[];
   numberOfRounds: number;
   numberOfTeams: number;
   draft: Draft;
}
const KeeperForm = ({
   team,
   userPicks,
   roster,
   players,
   numberOfRounds,
   numberOfTeams,
   draft,
}: KeeperFormProps) => {
   const supabase = createClientComponentClient<Database>();
   const picks = userPicks.map((pick: number) => {
      return Math.ceil(pick / numberOfTeams);
   });
   const [picksAvailable, setPicksAvailable] = useState<number[]>(picks);
   const [rosterState, setRosterState] = useState<RosterPlayer[]>(roster);

   useEffect(() => {
      roster.forEach((player) => {
         if (player.is_keeper) {
            const { picks_needed, picks_used } = player;
            const tempPicks: number[] = [];
            const picks: number[] = findClosestPick(picks_needed).sort(
               (a, b) => a - b
            );
            setPicksAvailable(
               picksAvailable.filter((pick) => !picks.includes(pick))
            );
         }
      });
   }, []);

   const findClosestPick = (picks: number[]) => {
      return picks
         .sort((a, b) => b - a)
         .map((pick) => {
            let closestPick =
               picksAvailable.sort((a, b) => b - a).find((x) => x <= pick) ?? 0;
            if (closestPick <= 0) return 0;

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
   const submitKeepers = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      rosterState.map(async (player) => {
         if (player.player_id && player.is_keeper) {
            await supabase
               .from('draft_selections')
               .upsert(
                  {
                     player_id: player.player_id,
                     draft_id: draft.id,
                     team_id: player.team_id,
                     pick: userPicks[player.picks_used[0] - 1],
                     round: player.picks_used[0],
                     is_keeper: player.is_keeper,
                  },
                  {
                     onConflict: 'player_id, draft_id',
                  }
               )
               .select();
            await supabase
               .from('team_history')
               .update({ is_keeper: true })
               .match({
                  player_id: player.player_id,
                  team_id: team.id,
               });
         } else {
            await supabase.from('draft_selections').delete().match({
               player_id: player.player_id,
               draft_id: draft.id,
            });
            await supabase
               .from('team_history')
               .update({ is_keeper: false })
               .match({
                  player_id: player.player_id,
                  team_id: team.id,
               });
         }
      });
   };

   return (
      <form className={'flex flex-col mt-2'} onSubmit={submitKeepers}>
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
