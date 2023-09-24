import { TeamViewProps } from '@/lib/types';
import { useEffect, useState } from 'react';

const Team = ({ players }: TeamViewProps) => {
   const [centers, setCenters] = useState<Player[]>([]);
   const [leftWings, setLeftWings] = useState<Player[]>([]);
   const [rightWings, setRightWings] = useState<Player[]>([]);
   const [defenseman, setDefenseman] = useState<Player[]>([]);
   const [goalies, setGoalies] = useState<Player[]>([]);
   const [goaliesBench, setGoaliesBench] = useState<Player[]>([]);
   const [bench, setBench] = useState<Player[]>([]);

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
      players.length === 0 && resetPlayers();
      if (players.length > 0) {
         let tempC: Player[] = [];
         let tempLW: Player[] = [];
         let tempRW: Player[] = [];
         let tempD: Player[] = [];
         let tempG: Player[] = [];
         let tempGB: Player[] = [];
         let tempB: Player[] = [];
         players?.forEach((player: Player) => {
            const { primary_position } = player;
            if (primary_position === 'Center' && tempC.length < 3) {
               !tempC.includes(player) && tempC.push(player);
            } else if (primary_position === 'Left Wing' && tempLW.length < 3) {
               !tempLW.includes(player) && tempLW.push(player);
            } else if (primary_position === 'Right Wing' && tempRW.length < 3) {
               !tempRW.includes(player) && tempRW.push(player);
            } else if (primary_position === 'Defenseman' && tempD.length < 3) {
               !tempD.includes(player) && tempD.push(player);
            } else if (primary_position === 'Goalie') {
               if (tempG.length < 2 && !tempG.includes(player)) {
                  tempG.push(player);
               } else {
                  !tempGB.includes(player) &&
                     !tempG.includes(player) &&
                     tempGB.push(player);
               }
            } else {
               !tempB.includes(player) && tempB.push(player);
            }
         });
         setCenters(tempC);
         setLeftWings(tempLW);
         setRightWings(tempRW);
         setDefenseman(tempD);
         setGoalies(tempG);
         setGoaliesBench(tempGB);
         setBench(tempB);
      }
   }, [players]);
   return (
      <table className="w-full">
         <thead className="bg-gold text-left">
            <tr>
               <th>Pos</th>
               <th>Player</th>
            </tr>
         </thead>
         <tbody>
            <tr>
               <td>C</td>
               <td>{setDisplayName(centers[0])}</td>
            </tr>
            <tr>
               <td>C</td>
               <td>{setDisplayName(centers[1])}</td>
            </tr>
            <tr>
               <td>C</td>
               <td>{setDisplayName(centers[2])}</td>
            </tr>
            <tr>
               <td>LW</td>
               <td>{setDisplayName(leftWings[0])}</td>
            </tr>
            <tr>
               <td>LW</td>
               <td>{setDisplayName(leftWings[1])}</td>
            </tr>
            <tr>
               <td>LW</td>
               <td>{setDisplayName(leftWings[2])}</td>
            </tr>
            <tr>
               <td>RW</td>
               <td>{setDisplayName(rightWings[0])}</td>
            </tr>
            <tr>
               <td>RW</td>
               <td>{setDisplayName(rightWings[1])}</td>
            </tr>
            <tr>
               <td>RW</td>
               <td>{setDisplayName(rightWings[2])}</td>
            </tr>
            <tr>
               <td>D</td>
               <td>{setDisplayName(defenseman[0])}</td>
            </tr>
            <tr>
               <td>D</td>
               <td>{setDisplayName(defenseman[1])}</td>
            </tr>
            <tr>
               <td>D</td>
               <td>{setDisplayName(defenseman[2])}</td>
            </tr>
            <tr>
               <td>D</td>
               <td>{setDisplayName(defenseman[3])}</td>
            </tr>
            <tr>
               <td>D</td>
               <td>{setDisplayName(defenseman[4])}</td>
            </tr>
            {bench.map((player: Player) => {
               return (
                  <tr key={player.id}>
                     <td>Bench</td>
                     <td>{setDisplayName(player)}</td>
                  </tr>
               );
            })}
            <tr>
               <td>G</td>
               <td>{setDisplayName(goalies[0])}</td>
            </tr>
            <tr>
               <td>G</td>
               <td>{setDisplayName(goalies[1])}</td>
            </tr>
            {goaliesBench.map((player) => {
               return (
                  <tr key={player.id}>
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
