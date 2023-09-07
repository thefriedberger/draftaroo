'use client';

import { PlayerStats } from '@/lib/types';
import { useContext, useEffect, useState } from 'react';
import { PageContext } from '../context/page-context';

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
   const { updateWatchlist } = useContext(PageContext);
   const [isWatched, setIsWatched] = useState<boolean>(false);

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

   const handleUpdateFeaturedPlayer = (player: Player, e: any) => {
      const target: HTMLElement = e.target;
      !['svg', 'path'].includes(target.localName) &&
         updateFeaturedPlayer(player);
   };

   return (
      player && (
         <>
            <tr
               key={player.id}
               className="my-1 cursor-pointer min-w-full"
               onClick={(e: any) => {
                  handleUpdateFeaturedPlayer(player, e);
               }}
            >
               <td className="mr-2 cursor-pointer table-cell align-middle w-[30px] fill-emerald-500">
                  {isWatched ? (
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                     >
                        <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                     </svg>
                  ) : (
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                     >
                        <path d="M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                     </svg>
                  )}
               </td>
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
