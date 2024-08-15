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
               ? picksUsed.filter((pick: number) =>
                    player.picks_used.every(
                       (neededPick: number) => neededPick !== pick
                    )
                 )
               : [...picksUsed, ...pickUsed]
         )
      );

      setRosterPlayers(
         rosterPlayers.map((rosterPlayer: RosterPlayer) =>
            player.player_id === rosterPlayer.player_id
               ? {
                    ...rosterPlayer,
                    is_keeper: !rosterPlayer.is_keeper,
                    picks_used: isChecked ? pickUsed : [],
                 }
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
         for (let i = rosterPlayer.picks_needed.length - 1; i >= 0; i--) {
            for (let j = availablePicks.length - 1; j >= 0; j--) {
               if (
                  !availablePicks[j].available ||
                  pickToUse.includes(rosterPlayer.picks_needed[i])
               ) {
                  break;
               } else {
                  if (availablePicks[j].pick <= rosterPlayer.picks_needed[i]) {
                     pickToUse.push(availablePicks[j].pick);
                  }
               }
            }
         }
         return pickToUse;
      }
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
      return pickToUse;
   };

   useEffect(() => {
      console.log(availablePicks);
   }, [availablePicks]);

   useEffect(() => {
      console.log(picksUsed);
   }, [picksUsed]);

   const picksAvailable = (rosterPlayer: RosterPlayer) => {
      let availablePickFound = false;

      if (rosterPlayer.picks_needed.length > 1) {
         for (let i = rosterPlayer.picks_needed.length - 1; i >= 0; i--) {
            for (let j = availablePicks.length - 1; j >= 0; j--) {
               if (!availablePicks[j].available) {
                  continue;
               } else {
                  if (availablePicks[j].pick <= rosterPlayer.picks_needed[i]) {
                     availablePickFound = true;
                     break;
                  }
               }
            }
         }
         return !availablePickFound;
      }
      for (let i = availablePicks.length - 1; i >= 0; i--) {
         if (
            !availablePicks[i].available ||
            picksUsed.includes(rosterPlayer.picks_needed[i])
         ) {
            break;
         } else {
            if (availablePicks[i].pick <= rosterPlayer.picks_needed[0]) {
               availablePickFound = true;
               continue;
            }
         }
      }
      for (let i = rosterPlayer.picks_needed.length - 1; i >= 0; i--) {
         for (let j = availablePicks.length - 1; j >= 0; j--) {
            if (!availablePicks[j].available) {
               continue;
            } else {
               if (availablePicks[j].pick <= rosterPlayer.picks_needed[i]) {
                  availablePickFound = true;
                  break;
               }
            }
         }
      }
      return !availablePickFound;
   };

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
