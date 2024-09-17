import { DraftContext } from '@/components/context/draft-context';
import { TeamViewProps } from '@/lib/types';
import { useContext, useEffect, useState } from 'react';

const Team = ({ players, doReset = false, setDoReset }: TeamViewProps) => {
   const { updateFeaturedPlayer } = useContext(DraftContext);
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
      }
      return () => {
         setDoReset?.(false);
      };
   }, [doReset]);

   useEffect(() => {
      if (players.length && !doReset) {
         const tempForwards: Player[] = [];
         const tempDefensemen: Player[] = [];
         const tempGoalies: Player[] = [];
         const tempBench: Player[] = [];
         const tempGoaliesBench: Player[] = [];
         for (const player of players) {
            const { primary_position } = player;
            if (primary_position) {
               if (forwardCodes.includes(primary_position)) {
                  if (tempForwards.length < 9) {
                     tempForwards.push(player);
                  } else {
                     tempBench.push(player);
                  }
               }
               if (primary_position === 'D') {
                  if (tempDefensemen.length < 5) {
                     tempDefensemen.push(player);
                  } else {
                     tempBench.push(player);
                  }
               }
               if (primary_position === 'G') {
                  if (tempGoalies.length < 2) {
                     tempGoalies.push(player);
                  } else {
                     tempGoaliesBench.push(player);
                  }
               }
            }
         }
         setForwards(tempForwards);
         setDefenseman(tempDefensemen);
         setGoalies(tempGoalies);
         setBench(tempBench);
         setGoaliesBench(tempGoaliesBench);
      }
   }, [players]);

   const getPlayer = (position: string, index: number) => {
      const playerToDisplay: Player = players.filter((player: Player) => {
         return player.primary_position === position;
      })[index];
      return setDisplayName(playerToDisplay);
   };

   return (
      <table className="w-full">
         <thead className="bg-gold text-left sticky top-0 lg:top-[35px]">
            <tr>
               <th colSpan={1}>Pos</th>
               <th colSpan={2}>Player</th>
            </tr>
         </thead>
         <tbody>
            {Array.from({ length: 9 }).map((val, index: number) => {
               return (
                  <tr
                     key={forwards?.[index]?.id ?? index}
                     onClick={() => {
                        forwards?.[index] &&
                           updateFeaturedPlayer?.(forwards[index]);
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
                           updateFeaturedPlayer?.(defenseman[index]);
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
                     onClick={() => updateFeaturedPlayer?.(player)}
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
                           updateFeaturedPlayer?.(goalies[index]);
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
                     onClick={() => updateFeaturedPlayer?.(player)}
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
