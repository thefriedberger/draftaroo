'use client';

import { RosterPlayer } from '@/app/leagues/tabs/keepers';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChangeEvent, useEffect, useState } from 'react';

export interface KeeperFormProps {
   team: Team;
   picks: number[];
   roster: RosterPlayer[];
   players: Player[];
   numberOfTeams: number;
   draft: Draft;
}
const KeeperForm = ({
   team,
   picks,
   roster,
   players,
   numberOfTeams,
   draft,
}: KeeperFormProps) => {
   const supabase = createClientComponentClient<Database>();
   const [availablePicks, setAvailablePicks] = useState<
      { pick: number; available: boolean }[]
   >([]);
   const [picksUsed, setPicksUsed] = useState<number[]>([]);
   const [rosterPlayers, setRosterPlayers] = useState<RosterPlayer[]>(roster);

   // update this to handle picks that aren't the one listed for player
   useEffect(() => {
      picks &&
         setAvailablePicks(
            picks.map((pick) => {
               if (picksUsed.includes(pick)) {
                  return { pick: pick, available: false };
               }
               return { pick: pick, available: true };
            })
         );
   }, [picks, picksUsed]);

   const handleSetKeeper = (
      change: ChangeEvent<HTMLInputElement>,
      player: RosterPlayer
   ) => {
      const isChecked = change.target.checked;

      const pickUsed = pickToUse(player);

      player.picks_needed.map((pick) =>
         setPicksUsed(
            !isChecked
               ? picksUsed.filter(
                    (pick: number) =>
                       player?.picks_used?.every(
                          (neededPick: number) => neededPick !== pick
                       ) ?? []
                 )
               : [...picksUsed, pickToUse(player)[0]] // update to handle multiple picks for first rounders
         )
      );

      setRosterPlayers(
         rosterPlayers.map((rosterPlayer: RosterPlayer) =>
            player.player_id === rosterPlayer.player_id
               ? {
                    ...rosterPlayer,
                    is_keeper: !rosterPlayer.is_keeper,
                    picks_used: pickUsed,
                 } // add picks_used for player kept
               : rosterPlayer
         )
      );

      //   if (draft && teamID !== '' && numberOfTeams > 0) {
      //      const round = Math.ceil(pick / numberOfTeams);
      //      const { data: draftSelections, error } = await supabase
      //         .from('draft_selections')
      //         .update({
      //            player_id: playerId,
      //            team_id: teamId,
      //            draft_id: draft.id,
      //            round: round,
      //            pick: pick,
      //            is_keeper: true,
      //         });
      //   }
   };

   const pickToUse = (rosterPlayer: RosterPlayer) => {
      let pickToUse: number[] = [];
      if (rosterPlayer.picks_needed.length > 1) {
      } else {
         for (let i = availablePicks.length - 1; i >= 0; i--) {
            if (!availablePicks[i].available) {
               continue;
            } else {
               if (rosterPlayer.picks_needed.length === 1) {
                  if (availablePicks[i].pick <= rosterPlayer.picks_needed[0]) {
                     pickToUse.push(availablePicks[i].pick);
                     break;
                  }
               }
            }
         }
      }
      return pickToUse;
   };
   const picksAvailable = (rosterPlayer: RosterPlayer) => {
      let availablePickFound = false;
      for (let i = availablePicks.length - 1; i >= 0; i--) {
         if (!availablePicks[i].available) {
            continue;
         } else {
            if (rosterPlayer.picks_needed.length === 1) {
               if (availablePicks[i].pick <= rosterPlayer.picks_needed[0]) {
                  availablePickFound = true;
                  break;
               }
            }
         }
      }
      return !availablePickFound;
      // const picksNeeded = player?.picks_needed;
      // if (!picksUsed.length) return false;
      // if (!picksNeeded) return false;
      // if (player?.is_keeper) return false;
      // if (picksNeeded.length > 1) {
      //    return;
      // }
      // for (let i = availablePicks.length - 1; i >= 0; i--) {
      //    console.log(picksNeeded[0], availablePicks[i]);
      //    if (
      //       picksNeeded[0] < availablePicks[i].pick &&
      //       availablePicks[i].available
      //    ) {
      //       continue;
      //    }
      //    return false;
      // }
      // return true;
      // return availablePicks.every(
      //    (pick: { pick: number; available: boolean }) =>
      //       picksNeeded[0] < pick.pick && pick.available
      // );
      //   return picksUsed.map((usedPick: number) =>
      //      player?.picks_needed?.every((pick: number) => usedPick > pick)
      //   );

      //   player?.picks_needed?.every((pick: number) => {
      //      return picksUsed.every((usedPick: number) => {
      //         usedPick <= pick;
      //      });
      //   });
   };

   useEffect(() => {
      console.log(availablePicks);
   }, [availablePicks]);

   useEffect(() => {
      console.log(rosterPlayers);
   }, [rosterPlayers]);
   return (
      <form className={'flex flex-col mt-2'}>
         <table>
            <thead className="bg-emerald-primary">
               <tr>
                  <th className={'w-[40px]'}>Keep Player</th>
                  <th className={'w-[40px]'}>Position</th>
                  <th>Player</th>
                  <th>Round Drafted</th>
                  <th>Pick(s) Used</th>
               </tr>
            </thead>
            <tbody>
               {rosterPlayers.map(
                  (rosterPlayer: RosterPlayer, index: number) => {
                     const playerData: Player | any = players.filter(
                        (playerToMatch) =>
                           playerToMatch.id === rosterPlayer.player_id
                     );
                     return (
                        <tr key={rosterPlayer.player_id}>
                           <td>
                              <input
                                 className={'w-[40px]'}
                                 type="checkbox"
                                 defaultChecked={
                                    rosterPlayer.is_keeper ?? false
                                 }
                                 disabled={
                                    picksAvailable(rosterPlayer) &&
                                    !rosterPlayer.is_keeper
                                 }
                                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleSetKeeper(e, rosterPlayer)
                                 }
                              />
                           </td>
                           <td className={'w-[40px]'}>
                              {playerData[0].primary_position}
                           </td>
                           <td>
                              {playerData[0].first_name}{' '}
                              {playerData[0].last_name}
                           </td>
                           <td>{rosterPlayer.draft_position ?? 'FA'}</td>
                           <td>
                              <select
                                 className="text-black"
                                 value={
                                    rosterPlayer.picks_used?.[0] ??
                                    pickToUse(rosterPlayer)[0]
                                 }
                                 disabled={true}
                              >
                                 {availablePicks
                                    .filter((pick) => {
                                       if (!rosterPlayer.draft_position)
                                          return pick.pick;
                                       return rosterPlayer.draft_position === 1
                                          ? rosterPlayer.draft_position ===
                                               pick.pick
                                          : rosterPlayer.draft_position - 1 >=
                                               pick.pick;
                                    })
                                    .map((pick) => {
                                       return (
                                          <option
                                             key={`${rosterPlayer.player_id}${pick.pick}`}
                                          >
                                             {pick.pick}
                                          </option>
                                       );
                                    })}
                              </select>
                           </td>
                        </tr>
                     );
                  }
               )}
               {/* {rosterPlayers
                  //   .sort((playerA: any, playerB: any) => {
                  //      if (playerA?.draft_position && playerB?.draft_position) {
                  //         return playerA.draft_position > playerB.draft_position;
                  //      }
                  //      return playerA;
                  //   })
                  ?.map((rosterPlayer, index) => {
                     const playerData: Player | any = players.filter(
                        (playerToMatch) =>
                           playerToMatch.id === rosterPlayer.player_id
                     );
                     // const picksNeeded = rosterPlayer?.picks_needed;
                     // let tempPicks = availablePicks.map((pick) => {
                     //    if (picksUsed.includes(pick.pick)) {
                     //       return { pick: pick.pick, available: false };
                     //    }
                     //    return { pick: pick.pick, available: true };
                     // });
                     // picksNeeded?.map((pickNeeded: number) => {
                     //    for (let i = availablePicks.length; i > 0; i--) {
                     //       if (
                     //          tempPicks[i].pick === pickNeeded &&
                     //          tempPicks[i].available
                     //       ) {
                     //          tempPicks[i].available = false;
                     //          setAvailablePicks([
                     //             ...availablePicks,
                     //             tempPicks[i],
                     //          ]);
                     //          return;
                     //       }
                     //    }
                     // });
                     const disablePick = picksAvailable(rosterPlayer);
                     return (
                        <tr
                           key={rosterPlayer.player_id}
                           className={classNames(
                              index % 2 === 0 && 'bg-gray-dark'
                           )}
                        >
                           <td>
                              <input
                                 className={'w-[40px]'}
                                 type="checkbox"
                                 defaultChecked={
                                    rosterPlayer.is_keeper ?? false
                                 }
                                 disabled={rosterPlayer.canKeep ?? false}
                                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleSetKeeper(e, rosterPlayer)
                                 }
                              />
                           </td>
                           <td className={'w-[40px]'}>
                              {playerData[0].primary_position}
                           </td>
                           <td>
                              {playerData[0].first_name}{' '}
                              {playerData[0].last_name}
                           </td>
                           <td>{rosterPlayer.draft_position ?? 'FA'}</td>
                           <td>
                              <select
                                 className={'text-black'}
                                 defaultValue={
                                    !rosterPlayer.draft_position
                                       ? picks.length - 1
                                       : rosterPlayer.draft_position === 1
                                       ? rosterPlayer.draft_position
                                       : rosterPlayer.draft_position + 1
                                 }
                              >
                                 {availablePicks
                                    .filter((pick) => {
                                       if (!rosterPlayer.draft_position)
                                          return pick.pick;
                                       return rosterPlayer.draft_position === 1
                                          ? rosterPlayer.draft_position ===
                                               pick.pick
                                          : rosterPlayer.draft_position >=
                                               pick.pick;
                                    })
                                    .map((pick) => {
                                       let shouldDisable = false;
                                       if (picksUsed.includes(pick.pick)) {
                                          shouldDisable = true;
                                       }
                                       return (
                                          <option
                                             key={`${rosterPlayer.player_id}${pick.pick}`}
                                             disabled={shouldDisable}
                                             selected={
                                                rosterPlayer.draft_position
                                                   ? rosterPlayer.draft_position +
                                                        1 ===
                                                     pick.pick
                                                   : false
                                             }
                                             value={
                                                !shouldDisable ? pick.pick : 0
                                             }
                                          >
                                             {pick.pick}
                                          </option>
                                       );
                                    })}
                              </select>
                           </td>
                        </tr>
                     );
                  })} */}
            </tbody>
         </table>
         <button
            className={
               'appearance-none border-0 bg-emerald-primary rounded-md w-fit mx-auto p-2 mt-2'
            }
            type="submit"
         >
            Submit Keepers
         </button>
      </form>
   );
};

export default KeeperForm;
