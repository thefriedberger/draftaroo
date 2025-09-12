import KeeperIcon from '@/app/assets/images/icons/keeper-icon';
import { DraftContext } from '@/components/context/draft-context';
import { DraftedPlayer, TeamViewProps } from '@/lib/types';
import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';

const Team = ({
   players,
   doReset = false,
   setDoReset,
   myTeam,
}: TeamViewProps) => {
   const { updateFeaturedPlayer } = useContext(DraftContext);
   const forwardCodes = ['C', 'L', 'R'];
   const [forwards, setForwards] = useState<DraftedPlayer[]>([]);
   const [defenseman, setDefenseman] = useState<DraftedPlayer[]>([]);
   const [goalies, setGoalies] = useState<DraftedPlayer[]>([]);
   const [goaliesBench, setGoaliesBench] = useState<DraftedPlayer[]>([]);
   const [bench, setBench] = useState<DraftedPlayer[]>([]);

   const setDisplayName = (player: DraftedPlayer) => {
      const displayName =
         player?.first_name !== undefined && player?.last_name !== undefined ? (
            <span
               className={classNames(
                  !myTeam && 'min-w-40 max-w-fit',
                  'flex flex-row items-center justify-between'
               )}
            >
               {player?.first_name.charAt(0)}. {player?.last_name}
               {player.is_keeper && (
                  <span className="ml-auto">
                     <KeeperIcon />
                  </span>
               )}
            </span>
         ) : (
            ''
         );
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
      }
      return () => {
         setDoReset?.(false);
      };
   }, [doReset]);

   useEffect(() => {
      if (players.length && !doReset) {
         const tempForwards: DraftedPlayer[] = [];
         const tempDefensemen: DraftedPlayer[] = [];
         const tempGoalies: DraftedPlayer[] = [];
         const tempBench: DraftedPlayer[] = [];
         const tempGoaliesBench: DraftedPlayer[] = [];

         for (const player of players.sort((a, b) => a.pick - b.pick)) {
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

   // const getPlayer = (position: string, index: number) => {
   //    const playerToDisplay: Player = players.filter((player: Player) => {
   //       return player.primary_position === position;
   //    })[index];
   //    return setDisplayName(playerToDisplay);
   // };

   return (
      <table className="w-full">
         <thead className="bg-gold text-left sticky top-0 lg:top-[35px]">
            <tr>
               <th>Pos</th>
               <th>Player</th>
               {!myTeam && <th>Pick</th>}
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
                     className={forwards?.[index] && 'cursor-pointer'}
                  >
                     <td>F</td>
                     <td>
                        {forwards?.[index] && setDisplayName(forwards[index])}
                     </td>
                     {!myTeam && <td>{forwards?.[index]?.pick}</td>}
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
                     className={defenseman?.[index] && 'cursor-pointer'}
                  >
                     <td>D</td>
                     <td>
                        {defenseman?.[index] &&
                           setDisplayName(defenseman[index])}
                     </td>
                     {!myTeam && <td>{defenseman?.[index]?.pick}</td>}
                  </tr>
               );
            })}
            {bench.map((player: DraftedPlayer) => {
               return (
                  <tr
                     key={player.id}
                     onClick={() => updateFeaturedPlayer?.(player)}
                     className={'cursor-pointer'}
                  >
                     <td>Bench</td>
                     <td>{setDisplayName(player)}</td>
                     {!myTeam && <td>{player.pick}</td>}
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
                     className={goalies?.[index] && 'cursor-pointer'}
                  >
                     <td>G</td>
                     <td>
                        {goalies?.[index] && setDisplayName(goalies[index])}
                     </td>
                     {!myTeam && <td>{goalies?.[index]?.pick}</td>}
                  </tr>
               );
            })}
            {goaliesBench.map((player) => {
               return (
                  <tr
                     key={player.id}
                     onClick={() => updateFeaturedPlayer?.(player)}
                     className={'cursor-pointer'}
                  >
                     <td>Bench</td>
                     <td>{setDisplayName(player)}</td>
                     {!myTeam && <td>{player.pick}</td>}
                  </tr>
               );
            })}
         </tbody>
      </table>
   );
};

export default Team;
