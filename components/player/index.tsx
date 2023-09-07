'use client';

import { PlayerStats } from '@/lib/types';
import { useContext, useEffect, useState } from 'react';
import { PageContext } from '../context/page-context';
import WatchlistStar from '../watchlist/watchlist-star';

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
   const { watchlist, updateWatchlist } = useContext(PageContext);

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
               className="my-1 min-w-full"
               onClick={(e: any) => {
                  handleUpdateFeaturedPlayer(player, e);
               }}
            >
               <td className="mr-2 cursor-pointer table-cell align-middle w-[30px] fill-emerald-500">
                  <WatchlistStar player={player} />
               </td>
               <td className="">
                  <span className="cursor-pointer">
                     {player.first_name} {player.last_name}
                  </span>
               </td>
               <td className="">
                  <span className="cursor-pointer">{player.current_team}</span>
               </td>
               <td className="">
                  <span className="cursor-pointer">
                     {player.primary_position &&
                        player.primary_position
                           .split(' ')
                           .map((char: string) => char[0])}
                  </span>
               </td>
               <td className="">
                  <span className="cursor-pointer">{points}</span>
               </td>
               <td className="">
                  <span className="cursor-pointer">{averagePoints}</span>
               </td>
               <td className="">
                  <span className="cursor-pointer">
                     {playerStats?.[season]?.stats?.games}
                  </span>
               </td>
               {player.primary_position !== 'Goalie' ? (
                  <>
                     <td className="">
                        <span className="cursor-pointer">
                           {getAverageTimeOnIce(player.stats)}
                        </span>
                     </td>
                     <td className="">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.goals}
                        </span>
                     </td>
                     <td className="">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.assists}
                        </span>
                     </td>
                     <td className="">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.plusMinus}
                        </span>
                     </td>
                     <td className="">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.shots}
                        </span>
                     </td>
                     <td className="">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.hits}
                        </span>
                     </td>
                     <td className="">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.blocked}
                        </span>
                     </td>
                     <td className="">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.pim}
                        </span>
                     </td>
                  </>
               ) : (
                  <>
                     <td className="">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.wins}
                        </span>
                     </td>
                     <td className="">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.losses}
                        </span>
                     </td>
                     <td className="">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.saves}
                        </span>
                     </td>
                     <td className="">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.goalsAgainst}
                        </span>
                     </td>
                     <td className="">
                        <span className="cursor-pointer">
                           {Math.round(
                              playerStats?.[season]?.stats?.goalAgainstAverage *
                                 100
                           ) / 100}
                        </span>
                     </td>
                     <td className="">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.shutouts}
                        </span>
                     </td>
                  </>
               )}
            </tr>
         </>
      )
   );
};

export default Player;
