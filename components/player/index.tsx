import { PlayerStats } from '@/lib/types';
import { useEffect, useState } from 'react';

const Player = ({
   player,
   leagueScoring,
   season,
   updateFeaturedPlayer,
}: {
   player: Player;
   leagueScoring: LeagueScoring | any;
   season: number;
   updateFeaturedPlayer: (player: Player | any) => void;
}) => {
   const [playerStats, setPlayerStats] = useState<PlayerStats[] | any>();
   const getStatFromLastSeason = (player_stats: any, stat: string) => {
      if (!player_stats) {
         return 0;
      }

      if (!player_stats[1]['stats']) {
         return 0;
      }

      if (!player_stats[1]['stats'][stat]) {
         return 0;
      }

      return player_stats[1]['stats'][stat];
   };

   const getAverageTimeOnIce = (player_stats: any) => {
      const games = getStatFromLastSeason(player_stats, 'games');
      const timeOnIce = getStatFromLastSeason(player_stats, 'timeOnIce');

      if (games === 0) {
         return 0;
      }

      return Math.floor(timeOnIce.split(':')[0] / games);
   };

   const [points, setPoints] = useState<number>(0);
   const [averagePoints, setAveragePoints] = useState<number>(0);
   useEffect(() => {
      if (player.stats) setPlayerStats(player.stats);
   }, []);

   useEffect(() => {
      if (playerStats?.[season] !== undefined && leagueScoring !== undefined) {
         const { stats } = playerStats?.[season];
         let tempPoints = 0;
         for (const stat in stats) {
            if (
               leagueScoring?.[stat] !== undefined &&
               stats?.[stat] !== undefined
            )
               tempPoints += leagueScoring?.[stat] * stats?.[stat];
         }
         setPoints(Math.round(tempPoints * 100) / 100);
         if (tempPoints !== 0)
            setAveragePoints(
               Math.round((tempPoints / stats?.games) * 100) / 100
            );
      }
   }, [playerStats, leagueScoring, season]);

   return (
      player && (
         <>
            <tr
               key={player.id}
               className="my-1 min-w-full"
               onClick={() => updateFeaturedPlayer(player)}
            >
               <td className="">
                  {player.first_name} {player.last_name}
               </td>
               <td className="">{player.current_team}</td>
               <td className="">
                  {player.primary_position &&
                     player.primary_position
                        .split(' ')
                        .map((char: string) => char[0])}
               </td>
               <td className="">{points}</td>
               <td className="">{averagePoints}</td>
               <td className="">{playerStats?.[season]?.stats?.games}</td>
               {player.primary_position !== 'Goalie' ? (
                  <>
                     <td className="">{getAverageTimeOnIce(player.stats)}</td>
                     <td className="">{playerStats?.[season]?.stats?.goals}</td>
                     <td className="">
                        {playerStats?.[season]?.stats?.assists}
                     </td>
                     <td className="">
                        {playerStats?.[season]?.stats?.plusMinus}
                     </td>
                     <td className="">{playerStats?.[season]?.stats?.shots}</td>
                     <td className="">{playerStats?.[season]?.stats?.hits}</td>
                     <td className="">
                        {playerStats?.[season]?.stats?.blocked}
                     </td>
                     <td className="">{playerStats?.[season]?.stats?.pim}</td>
                  </>
               ) : (
                  <>
                     <td className="">{playerStats?.[season]?.stats?.wins}</td>
                     <td className="">
                        {playerStats?.[season]?.stats?.losses}
                     </td>
                     <td className="">{playerStats?.[season]?.stats?.saves}</td>
                     <td className="">
                        {playerStats?.[season]?.stats?.goalsAgainst}
                     </td>
                     <td className="">
                        {Math.round(
                           playerStats?.[season]?.stats?.goalAgainstAverage *
                              100
                        ) / 100}
                     </td>
                     <td className="">
                        {playerStats?.[season]?.stats?.shutouts}
                     </td>
                  </>
               )}
            </tr>
         </>
      )
   );
};

export default Player;
