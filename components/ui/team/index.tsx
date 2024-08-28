import { TeamViewProps } from '@/lib/types';
import { useEffect, useState } from 'react';

const Team = ({
   players,
   doReset,
   setDoReset,
   updateFeaturedPlayer,
}: TeamViewProps) => {
   const forwardCodes = ['C', 'L', 'R'];
   const [forwards, setForwards] = useState<Player[]>([]);
   const [defenseman, setDefenseman] = useState<Player[]>([]);
   const [goalies, setGoalies] = useState<Player[]>([]);
   const [goaliesBench, setGoaliesBench] = useState<Player[]>([]);
   const [bench, setBench] = useState<Player[]>([]);

   const [playersArray, setPlayersArray] = useState<Player[]>([]);

   const setDisplayName = (player: Player) => {
      const displayName =
         player?.first_name !== undefined && player?.last_name !== undefined
            ? `${player?.first_name.charAt(0)}. ${player?.last_name}`
            : '';
      return displayName;
   };

   const resetPlayers = () => {
      setForwards([]);
      setDefenseman([]);
      setGoalies([]);
      setGoaliesBench([]);
      setBench([]);
   };
   useEffect(() => {
      if (doReset) {
         resetPlayers();
         setPlayersArray([]);
         setTimeout(() => {
            setDoReset?.(false);
         }, 250);
      }
   }, [doReset]);

   useEffect(() => {
      players.length === 0 && resetPlayers();
      if (players.length && !doReset) {
         if (forwards.length < 9) {
            setForwards(
               players.filter(
                  (player) =>
                     player.primary_position &&
                     forwardCodes.includes(player.primary_position)
               )
            );
         }
         if (defenseman.length < 5) {
            setDefenseman(
               players.filter(
                  (player) =>
                     player.primary_position && player.primary_position === 'D'
               )
            );
         }
         if (goalies.length < 2) {
            setGoalies(
               players.filter(
                  (player) =>
                     player.primary_position && player.primary_position === 'G'
               )
            );
         }
      }
   }, [players]);

   useEffect(() => {
      setBench(
         players.filter(
            (player) =>
               player.primary_position !== 'G' &&
               !forwards.concat(defenseman).includes(player)
         )
      );

      setGoaliesBench(
         players.filter(
            (player) =>
               player.primary_position === 'G' && !goalies.includes(player)
         )
      );
   }, [forwards, defenseman, goalies]);

   const getPlayer = (position: string, index: number) => {
      const playerToDisplay: Player = players.filter((player: Player) => {
         return player.primary_position === position;
      })[index];
      return setDisplayName(playerToDisplay);
   };

   return (
      <table className="w-full">
         <thead className="bg-gold text-left">
            <tr>
               <th>Pos</th>
               <th>Player</th>
            </tr>
         </thead>
         <tbody>
            {Array.from({ length: 9 }).map((val, index: number) => {
               return (
                  <tr
                     key={forwards?.[index]?.id ?? index}
                     onClick={() => {
                        forwards?.[index] &&
                           updateFeaturedPlayer(forwards[index]);
                     }}
                  >
                     <td>F</td>
                     <td>
                        {forwards?.[index] && setDisplayName(forwards[index])}
                     </td>
                  </tr>
               );
            })}
            {Array.from({ length: 5 }).map((val, index: number) => {
               return (
                  <tr
                     key={defenseman?.[index]?.id ?? index}
                     onClick={() => {
                        defenseman?.[index] &&
                           updateFeaturedPlayer(defenseman[index]);
                     }}
                  >
                     <td>D</td>
                     <td>
                        {defenseman?.[index] &&
                           setDisplayName(defenseman[index])}
                     </td>
                  </tr>
               );
            })}
            {bench.map((player: Player) => {
               return (
                  <tr
                     key={player.id}
                     onClick={() => updateFeaturedPlayer(player)}
                  >
                     <td>Bench</td>
                     <td>{setDisplayName(player)}</td>
                  </tr>
               );
            })}
            {Array.from({ length: 2 }).map((val, index: number) => {
               return (
                  <tr
                     key={goalies?.[index]?.id ?? index}
                     onClick={() => {
                        goalies?.[index] &&
                           updateFeaturedPlayer(goalies[index]);
                     }}
                  >
                     <td>G</td>
                     <td>
                        {goalies?.[index] && setDisplayName(goalies[index])}
                     </td>
                  </tr>
               );
            })}
            {goaliesBench.map((player) => {
               return (
                  <tr
                     key={player.id}
                     onClick={() => updateFeaturedPlayer(player)}
                  >
                     <td>Bench</td>
                     <td>{setDisplayName(player)}</td>
                  </tr>
               );
            })}
         </tbody>
      </table>
   );
};

export default Team;
