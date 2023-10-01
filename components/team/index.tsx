import { TeamViewProps } from '@/lib/types';
import { useEffect, useState } from 'react';

const Team = ({
   players,
   doReset,
   setDoReset,
   updateFeaturedPlayer,
}: TeamViewProps) => {
   const [centers, setCenters] = useState<Player[]>([]);
   const [leftWings, setLeftWings] = useState<Player[]>([]);
   const [rightWings, setRightWings] = useState<Player[]>([]);
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
      setCenters([]);
      setLeftWings([]);
      setRightWings([]);
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
      if (players.length > 0 && !doReset) {
         const tempCenters: Player[] = [];
         const tempLeftWings: Player[] = [];
         const tempRightWings: Player[] = [];
         const tempDefenseman: Player[] = [];
         const tempBench: Player[] = [];
         const tempGoalies: Player[] = [];
         const tempGoaliesBench: Player[] = [];
         players.forEach((player: Player) => {
            if (!playersArray.includes(player)) {
               const { primary_position } = player;
               if (primary_position === 'Center' && tempCenters.length < 3) {
                  if (!centers.includes(player)) {
                     tempCenters.push(player);
                     setCenters((prev) => {
                        return [...prev, player];
                     });
                  }
               } else if (
                  primary_position === 'Left Wing' &&
                  tempLeftWings.length < 3
               ) {
                  if (!leftWings.includes(player)) {
                     tempLeftWings.push(player);
                     setLeftWings((prev) => {
                        return [...prev, player];
                     });
                  }
               } else if (
                  primary_position === 'Right Wing' &&
                  tempRightWings.length < 3
               ) {
                  if (!rightWings.includes(player)) {
                     tempRightWings.push(player);
                     setRightWings((prev) => {
                        return [...prev, player];
                     });
                  }
               } else if (
                  primary_position === 'Defenseman' &&
                  tempDefenseman.length < 5
               ) {
                  if (!defenseman.includes(player)) {
                     tempDefenseman.push(player);
                     setDefenseman((prev) => {
                        return [...prev, player];
                     });
                  }
               } else if (
                  primary_position === 'Goalie' &&
                  tempGoalies.length < 2
               ) {
                  if (!goalies.includes(player)) {
                     tempGoalies.push(player);
                     setGoalies((prev) => {
                        return [...prev, player];
                     });
                  }
               } else {
                  if (primary_position === 'Goalie') {
                     !goaliesBench.includes(player) &&
                        setGoaliesBench((prev) => {
                           return [...prev, player];
                        });
                  } else {
                     if (!bench.includes(player)) {
                        setBench((prev) => {
                           return [...prev, player];
                        });
                     }
                  }
               }
               setPlayersArray((prev) => [...prev, player]);
            }
         });
      }
   }, [players, doReset, playersArray]);

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
            <tr onClick={() => updateFeaturedPlayer(centers[0])}>
               <td>C</td>
               <td>{setDisplayName(centers[0])}</td>
            </tr>
            <tr onClick={() => updateFeaturedPlayer(centers[1])}>
               <td>C</td>
               <td>{setDisplayName(centers[1])}</td>
            </tr>
            <tr onClick={() => updateFeaturedPlayer(centers[2])}>
               <td>C</td>
               <td>{setDisplayName(centers[2])}</td>
            </tr>
            <tr onClick={() => updateFeaturedPlayer(leftWings[0])}>
               <td>LW</td>
               <td>{setDisplayName(leftWings[0])}</td>
            </tr>
            <tr onClick={() => updateFeaturedPlayer(leftWings[1])}>
               <td>LW</td>
               <td>{setDisplayName(leftWings[1])}</td>
            </tr>
            <tr onClick={() => updateFeaturedPlayer(leftWings[2])}>
               <td>LW</td>
               <td>{setDisplayName(leftWings[2])}</td>
            </tr>
            <tr onClick={() => updateFeaturedPlayer(rightWings[0])}>
               <td>RW</td>
               <td>{setDisplayName(rightWings[0])}</td>
            </tr>
            <tr onClick={() => updateFeaturedPlayer(rightWings[1])}>
               <td>RW</td>
               <td>{setDisplayName(rightWings[1])}</td>
            </tr>
            <tr onClick={() => updateFeaturedPlayer(rightWings[2])}>
               <td>RW</td>
               <td>{setDisplayName(rightWings[2])}</td>
            </tr>
            <tr onClick={() => updateFeaturedPlayer(defenseman[0])}>
               <td>D</td>
               <td>{setDisplayName(defenseman[0])}</td>
            </tr>
            <tr onClick={() => updateFeaturedPlayer(defenseman[1])}>
               <td>D</td>
               <td>{setDisplayName(defenseman[1])}</td>
            </tr>
            <tr onClick={() => updateFeaturedPlayer(defenseman[2])}>
               <td>D</td>
               <td>{setDisplayName(defenseman[2])}</td>
            </tr>
            <tr onClick={() => updateFeaturedPlayer(defenseman[3])}>
               <td>D</td>
               <td>{setDisplayName(defenseman[3])}</td>
            </tr>
            <tr onClick={() => updateFeaturedPlayer(defenseman[4])}>
               <td>D</td>
               <td>{setDisplayName(defenseman[4])}</td>
            </tr>
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
            <tr onClick={() => updateFeaturedPlayer(goalies[0])}>
               <td>G</td>
               <td>{setDisplayName(goalies[0])}</td>
            </tr>
            <tr onClick={() => updateFeaturedPlayer(goalies[1])}>
               <td>G</td>
               <td>{setDisplayName(goalies[1])}</td>
            </tr>
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
