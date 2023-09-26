'use client';

import { PlayerListProps } from '@/lib/types';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { PageContext } from '../context/page-context';
import PlayerComponent from '../player';

type SortValue =
   | 'score'
   | 'averageScore'
   | 'timeOnIcePerGame'
   | 'games'
   | 'goals'
   | 'assists'
   | 'plusMinus'
   | 'pim'
   | 'powerPlayGoals'
   | 'powerPlayAssists'
   | 'shortHandedGoals'
   | 'shortHandedAssists'
   | 'shots'
   | 'hits'
   | 'blocked'
   | 'goalsAgainst'
   | 'wins'
   | 'saves'
   | 'shutouts'
   | 'goalAgainstAverage'
   | 'losses'
   | '';

export const getStatFromLastSeason = (
   player_stats: any,
   stat: string,
   season: number
) => {
   return !player_stats?.[season]?.['stats']?.[stat]
      ? 0
      : player_stats[season]['stats'][stat];
};
export const sortPlayers = (
   players: Player[],
   sort: string,
   season: number
) => {
   players.sort((a: Player, b: Player) => {
      const statForA = getStatFromLastSeason(a.stats, sort, season);
      const statForB = getStatFromLastSeason(b.stats, sort, season);
      if (sort === 'timeOnIcePerGame') {
         const timeA = String(statForA);
         const timeB = String(statForB);

         if (timeA.split(':').length > 1) {
            if (timeB.split(':').length > 1) {
               return (
                  Number(timeB.split(':')?.[0] + timeB.split(':')?.[1]) -
                  Number(timeA.split(':')?.[0] + timeA.split(':')?.[1])
               );
            } else {
               return (
                  Number(timeB.split(':')[0]) -
                  Number(timeA.split(':')[0] + timeA.split(':')[1])
               );
            }
         }
         return Number(timeB.split(':')[0]) - Number(timeA.split(':')[0]);
      }
      return statForB - statForA;
   });

   return players;
};
const PlayerList = ({
   updateFeaturedPlayer,
   leagueID,
   players,
}: PlayerListProps) => {
   const [leagueScoring, setLeagueScoring] = useState<LeagueScoring | any>();
   const [league, setLeague] = useState<League | any>();
   const [sort, setSort] = useState<SortValue>('score');
   const [positionFilter, setPositionFilter] = useState<string>('Skaters');
   const [teamFilter, setTeamFilter] = useState<string>('Team');
   const [playerSearch, setPlayerSearch] = useState<string>('');
   const [season, setSeason] = useState<number>(1);
   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

   const { leagues } = useContext(PageContext);

   const teams = [
      'Team',
      'Arizona Coyotes',
      'Anaheim Ducks',
      'Boston Bruins',
      'Buffalo Sabres',
      'Calgary Flames',
      'Carolina Hurricanes',
      'Colorado Avalanche',
      'Columbus Blue Jackets',
      'Dallas Stars',
      'Detroit Red Wings',
      'Edmonton Oilers',
      'Florida Panthers',
      'Los Angeles Kings',
      'Minnesota Wild',
      'Montréal Canadiens',
      'Nashville Predators',
      'New Jersey Devils',
      'New York Islanders',
      'New York Rangers',
      'Ottawa Senators',
      'Philadelphia Flyers',
      'Pittsburgh Penguins',
      'San Jose Sharks',
      'Seattle Kraken',
      'St. Louis Blues',
      'Tampa Bay Lightning',
      'Tornto Maple Leafs',
      'Vancouver Canucks',
      'Vegas Golden Knights',
      'Washington Capitals',
      'Winnipeg Jets',
   ];
   const positions = [
      'Skaters',
      'Goalie',
      'Center',
      'Left Wing',
      'Right Wing',
      'Defenseman',
   ];

   const seasons = ['Season', '2021-2022', '2022-2023'];

   useEffect(() => {
      if (leagues)
         setLeague(
            leagues?.filter((league: League) => {
               return league.league_id === leagueID && league;
            })
         );
   }, [leagues]);

   const filterPlayers = () => {
      const playersByPostion = players.filter((player: Player) => {
         if (positionFilter === 'Skaters')
            return player.primary_position !== 'Goalie';
         if (positionFilter != '') {
            return player.primary_position === positionFilter;
         } else {
            return true;
         }
      });

      const playersByTeam = playersByPostion.filter((player: Player) => {
         if (teamFilter != 'Team') {
            return player.current_team === teamFilter;
         } else {
            return true;
         }
      });

      const playersSearched = playersByTeam.filter((player: Player) => {
         if (playerSearch != '') {
            const fullName = player.first_name + ' ' + player.last_name;
            return fullName.toLowerCase().includes(playerSearch.toLowerCase());
         } else {
            return true;
         }
      });

      if (sort != '') {
         return sortPlayers(playersSearched, sort, season);
      } else {
         return playersSearched;
      }
   };

   return (
      <>
         {players && (
            <div className="flex flex-col items-center h-full max-h-full w-full text-black">
               <div className="flex flex-col sticky top-0 z-10 bg-gray-primary lg:z-0 lg:bg-transparent lg:static lg:flex-row w-full lg:w-auto justify-start self-start items-stretch lg:items-end">
                  <div className="grid grid-cols-3">
                     <Filter values={positions} filterFun={setPositionFilter} />
                     <Filter values={teams} filterFun={setTeamFilter} />
                     <div className="flex flex-col">
                        <select
                           defaultValue={1}
                           className="text-black p-1 lg:mr-2"
                           onChange={(e: ChangeEvent) => {
                              const target = e.target as HTMLSelectElement;
                              setSeason(Number(target?.value));
                           }}
                        >
                           <option value="0">2021-2022</option>
                           <option value="1">2022-2023</option>
                        </select>
                     </div>
                  </div>
                  <input
                     className="text-black p-1"
                     type="search"
                     placeholder="Search players"
                     value={playerSearch}
                     onChange={(e) => setPlayerSearch(e.target.value)}
                  />
               </div>
               <div className=" w-full md:h-full overflow-y-scroll relative">
                  <table className="w-full text-sm relative">
                     <thead className="w-full sticky top-0">
                        <tr className="bg-gray-700 text-white dark:bg-gold min-w-full text-left">
                           <th></th>
                           <th
                              className="my-2 cursor-pointer"
                              onClick={(e) => setSort('')}
                           >
                              Name
                           </th>
                           <th
                              className="my-2 cursor-pointer"
                              onClick={(e) => setSort('score')}
                           >
                              Score
                           </th>
                           <th
                              className="my-2 cursor-pointer"
                              onClick={(e) => setSort('averageScore')}
                           >
                              Avg Score
                           </th>
                           <th
                              className="my-2 cursor-pointer"
                              onClick={(e) => setSort('games')}
                           >
                              GP
                           </th>
                           {positionFilter !== 'Goalie' ? (
                              <>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('timeOnIcePerGame')}
                                 >
                                    ATOI
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('goals')}
                                 >
                                    G
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('assists')}
                                 >
                                    A
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('plusMinus')}
                                 >
                                    +/-
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('pim')}
                                 >
                                    PIM
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('powerPlayGoals')}
                                 >
                                    PPG
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('powerPlayAssists')}
                                 >
                                    PPA
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('shortHandedGoals')}
                                 >
                                    SHG
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) =>
                                       setSort('shortHandedAssists')
                                    }
                                 >
                                    SHA
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('shots')}
                                 >
                                    SOG
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('hits')}
                                 >
                                    HIT
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('blocked')}
                                 >
                                    BLK
                                 </th>
                              </>
                           ) : (
                              <>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('wins')}
                                 >
                                    W
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('losses')}
                                 >
                                    L
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('saves')}
                                 >
                                    S
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('goalsAgainst')}
                                 >
                                    GA
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) =>
                                       setSort('goalAgainstAverage')
                                    }
                                 >
                                    GAA
                                 </th>
                                 <th
                                    className="my-2 cursor-pointer"
                                    onClick={(e) => setSort('shutouts')}
                                 >
                                    SO
                                 </th>
                              </>
                           )}
                        </tr>
                     </thead>
                     <tbody>
                        {players?.length > 0 &&
                           filterPlayers().map((player: Player) => {
                              return (
                                 <PlayerComponent
                                    key={player.id}
                                    player={player}
                                    leagueScoring={leagueScoring}
                                    season={season}
                                    updateFeaturedPlayer={updateFeaturedPlayer}
                                 />
                              );
                           })}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </>
   );
};

const Filter = ({ values, filterFun }: any) => {
   return (
      <select
         onChange={(e) => filterFun(e.target.value)}
         className="text-black p-1 lg:mr-2"
      >
         {values.map((x: any) => {
            return (
               <option key={x} value={x}>
                  {x}
               </option>
            );
         })}
      </select>
   );
};

export default PlayerList;
