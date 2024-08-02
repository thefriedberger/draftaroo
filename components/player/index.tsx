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
   'Montréal Canadiens': 'MTL',
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

const PlayerComponent = ({
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
   const [playerStats, setPlayerStats] = useState<PlayerStats[]>();
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

   useEffect(() => {
      if (player.stats) setPlayerStats(player.stats as PlayerStats[]);
   }, []);

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
                  <span className="cursor-pointer whitespace-nowrap">
                     {player.first_name} {player.last_name}
                     &nbsp;&nbsp;&nbsp;
                     <span className="dark:text-gray-300 text-[11px] leading-3 whitespace-nowrap">
                        {teamAbreviations?.[player.current_team] || 'FA'} -{' '}
                        {player.primary_position &&
                           player.primary_position
                              .split(' ')
                              .map((char: string) => char[0])}
                     </span>
                  </span>
               </td>
               <td className="py-2 px-1">
                  <span className="cursor-pointer">
                     {playerStats?.[season]?.stats?.score}
                  </span>
               </td>
               <td className="py-2 px-1">
                  <span className="cursor-pointer">
                     {playerStats?.[season]?.stats?.averageScore}
                  </span>
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
                           {playerStats?.[season]?.stats?.timeOnIcePerGame || 0}
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
                           {playerStats?.[season]?.stats?.powerPlayAssists || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.shortHandedGoals || 0}
                        </span>
                     </td>
                     <td className="py-2 px-1">
                        <span className="cursor-pointer">
                           {playerStats?.[season]?.stats?.shortHandedAssists ||
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
                              (playerStats?.[season]?.stats
                                 ?.goalAgainstAverage || 1) * 100
                           ) / 100}
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

export default PlayerComponent;
