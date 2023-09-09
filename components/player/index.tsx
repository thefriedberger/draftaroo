'use client';

import { PlayerStats } from '@/lib/types';
import { useContext, useEffect, useState } from 'react';
import { PageContext } from '../context/page-context';
import WatchlistStar from '../watchlist/watchlist-star';

export const teamAbreviations: string | any = {
   'Anaheim Ducks': 'ANA',
   'Arizona Coyotes': 'ARI',
   'Buffalo Sabres': 'BUF',
   'Boston Bruins': 'BOS',
   'Calgary Flames': 'CGY',
   'Carolina Hurricanes': 'CAR',
   'Chicago Blackhawks': 'CHI',
   'Columbus Blue Jackets': 'CBJ',
   'Colorado Avalanche': 'COL',
   'Dallas Stars': 'DAL',
   'Detroit Red Wings': 'DET',
   'Edmonton Oilers': 'EDM',
   'Florida Panthers': 'FLA',
   'Los Angeles Kings': 'LAK',
   'Minnesota Wild': 'MIN',
   'Montreal Canadiens': 'MTL',
   'New Jersey Devils': 'NJD',
   'Nashville Predators': 'NSH',
   'New York Islanders': 'NYI',
   'New York Rangers': 'NYR',
   'Ottawa Senators': 'OTT',
   'Philadelphia Flyers': 'PHI',
   'Pittsburgh Penguins': 'PIT',
   'Seattle Kraken': 'SEA',
   'San Jose Sharks': 'SJS',
   'St. Louis Blues': 'STL',
   'Tampa Bay Lightning': 'TBL',
   'Toronto Maple Leafs': 'TOR',
   'Vancouver Canucks': 'VAN',
   'Vegas Golden Knights': 'VGK',
   'Winnipeg Jets': 'WPG',
   'Washington Capitals': 'WSH',
};

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
               (leagueScoring?.[stat] !== undefined || leagueScoring?.[stat]) &&
               (stats?.[stat] !== undefined || stats?.[stat])
            ) {
               if (stat === 'powerPlayPoints') {
                  tempPoints +=
                     leagueScoring?.['powerPlayAssists'] *
                     (stats?.['powerPlayPoints'] - stats?.['powerPlayGoals']);
               } else if (stat === 'shortHandedPoints') {
                  tempPoints +=
                     leagueScoring?.['shortHandedAssists'] *
                     (stats?.['shortHandedPoints'] -
                        stats?.['shortHandedGoals']);
               } else {
                  tempPoints += leagueScoring?.[stat] * stats?.[stat];
               }
            }
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
               <td className="py-2 px-1">
                  <span className="cursor-pointer">
                     {player.first_name} {player.last_name}
                     &nbsp;&nbsp;&nbsp;
                     <span className="dark:text-gray-300 text-[11px] leading-3">
                        {teamAbreviations?.[player.current_team] || 'FA'} -{' '}
                        {player.primary_position &&
                           player.primary_position
                              .split(' ')
                              .map((char: string) => char[0])}
                     </span>
                  </span>
               </td>
               <td className="py-2 px-1">
                  <span className="cursor-pointer">{points}</span>
               </td>
               <td className="py-2 px-1">
                  <span className="cursor-pointer">{averagePoints}</span>
               </td>
               <td className="py-2 px-1">
                  <span className="cursor-pointer">
                     {playerStats?.[season]?.stats?.games || 0}
                  </span>
               </td>
               {player.primary_position !== 'Goalie' ? (
                  <>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {getAverageTimeOnIce(player.stats) || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.goals || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.assists || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.plusMinus || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.pim || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.powerPlayGoals || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.powerPlayPoints -
                              playerStats?.[season]?.stats?.powerPlayGoals || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.shortHandedGoals || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.shortHandedPoints -
                              playerStats?.[season]?.stats?.shortHandedGoals ||
                              0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.shots || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.hits || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.blocked || 0}
                        </span>
                     </td>
                  </>
               ) : (
                  <>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.wins || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.losses || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.saves || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.goalsAgainst || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {Math.round(
                              playerStats?.[season]?.stats?.goalAgainstAverage *
                                 100
                           ) / 100 || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.shutouts || 0}
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
