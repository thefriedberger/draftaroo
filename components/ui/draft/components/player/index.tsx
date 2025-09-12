'use client';

import { convertTime } from '@/app/utils/helpers';
import { DraftContext } from '@/components/context/draft-context';
import { SortValue } from '@/lib/constants';
import { PlayerStats } from '@/lib/types';
import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import WatchlistStar from '../watchlist/watchlist-star';

export const teamAbbreviations: string | any = {
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
   sort,
}: {
   player: Player;
   leagueScoring?: LeagueScoring | any;
   season: number;
   sort: SortValue;
}) => {
   const { updateFeaturedPlayer } = useContext(DraftContext);
   const [playerStats, setPlayerStats] = useState<PlayerStats[]>(
      player?.stats as PlayerStats[]
   );

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
         updateFeaturedPlayer?.(player);
   };

   return (
      <>
         <tr
            key={player.id}
            className="my-1 min-w-full cursor-pointer"
            onClick={(e: any) => {
               handleUpdateFeaturedPlayer(player, e);
            }}
         >
            <td className="w-[20px] align-middle">
               <WatchlistStar player={player} />
            </td>
            <td className="py-2 px-1">
               <span className="whitespace-nowrap">
                  {player.first_name} {player.last_name}
                  &nbsp;&nbsp;&nbsp;
                  <span className="dark:text-gray-300 text-[11px] leading-3 whitespace-nowrap">
                     {teamAbbreviations?.[player.current_team] || 'FA'} -{' '}
                     {player.primary_position &&
                        player.primary_position
                           .split(' ')
                           .map((char: string) => char[0])}
                  </span>
               </span>
            </td>
            <td className="py-2 px-1">
               <span className={classNames(sort === 'score' && 'font-bold')}>
                  {playerStats?.[season]?.stats?.score}
               </span>
            </td>
            <td className="py-2 px-1">
               <span
                  className={classNames(sort === 'averageScore' && 'font-bold')}
               >
                  {playerStats?.[season]?.stats?.averageScore}
               </span>
            </td>
            <td className="py-2 px-1">
               <span className={classNames(sort === 'games' && 'font-bold')}>
                  {playerStats?.[season]?.stats?.games || 0}
               </span>
            </td>
            {player.primary_position !== 'G' ? (
               <>
                  {/* {Object.keys(playerStats?.[season]?.stats ?? {}).map(
                     (stat: any) => (
                        <PlayerRow
                           key={`${player.id}-${stat}`}
                           stat={stat}
                           player={player}
                           playerStats={playerStats?.[season]?.stats?.[stat]}
                        />
                     )
                  )} */}
                  <td className="py-2 px-1">
                     <span
                        className={classNames(
                           sort === 'timeOnIcePerGame' && 'font-bold'
                        )}
                     >
                        {playerStats?.[season]?.stats?.timeOnIcePerGame !==
                        undefined
                           ? convertTime(
                                playerStats?.[season]?.stats
                                   ?.timeOnIcePerGame ?? 0
                             )
                           : 0}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(sort === 'goals' && 'font-bold')}
                     >
                        {playerStats?.[season]?.stats?.goals || 0}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(
                           sort === 'assists' && 'font-bold'
                        )}
                     >
                        {playerStats?.[season]?.stats?.assists || 0}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(sort === 'pim' && 'font-bold')}
                     >
                        {playerStats?.[season]?.stats?.pim || 0}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(
                           sort === 'powerPlayGoals' && 'font-bold'
                        )}
                     >
                        {playerStats?.[season]?.stats?.powerPlayGoals || 0}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(
                           sort === 'powerPlayAssists' && 'font-bold'
                        )}
                     >
                        {playerStats?.[season]?.stats?.powerPlayAssists || 0}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(
                           sort === 'shortHandedGoals' && 'font-bold'
                        )}
                     >
                        {playerStats?.[season]?.stats?.shortHandedGoals || 0}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(
                           sort === 'shortHandedAssists' && 'font-bold'
                        )}
                     >
                        {playerStats?.[season]?.stats?.shortHandedAssists || 0}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(sort === 'shots' && 'font-bold')}
                     >
                        {playerStats?.[season]?.stats?.shots || 0}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(sort === 'hits' && 'font-bold')}
                     >
                        {playerStats?.[season]?.stats?.hits || 0}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(
                           sort === 'blocked' && 'font-bold'
                        )}
                     >
                        {playerStats?.[season]?.stats?.blocked || 0}
                     </span>
                  </td>
               </>
            ) : (
               <>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(sort === 'wins' && 'font-bold')}
                     >
                        {playerStats?.[season]?.stats?.wins || 0}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(sort === 'losses' && 'font-bold')}
                     >
                        {playerStats?.[season]?.stats?.losses || 0}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(sort === 'saves' && 'font-bold')}
                     >
                        {playerStats?.[season]?.stats?.saves || 0}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(
                           sort === 'goalsAgainst' && 'font-bold'
                        )}
                     >
                        {playerStats?.[season]?.stats?.goalsAgainst || 0}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(
                           sort === 'goalAgainstAverage' && 'font-bold'
                        )}
                     >
                        {Math.round(
                           (playerStats?.[season]?.stats?.goalAgainstAverage ||
                              1) * 100
                        ) / 100}
                     </span>
                  </td>
                  <td className="py-2 px-1">
                     <span
                        className={classNames(
                           sort === 'shutouts' && 'font-bold'
                        )}
                     >
                        {playerStats?.[season]?.stats?.shutouts || 0}
                     </span>
                  </td>
               </>
            )}
         </tr>
      </>
   );
};

export default PlayerComponent;

export const PlayerRow = ({
   stat,
   player,
   playerStats,
}: {
   stat: any;
   player: Player;
   playerStats: PlayerStats[];
}) => {
   return <></>;
};
