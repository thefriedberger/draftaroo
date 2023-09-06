'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { PageContext } from '../context/page-context';
import Player from '../player';

const PlayerList = ({
   updateFeaturedPlayer,
   leagueID,
}: {
   updateFeaturedPlayer: (player: Player | any) => void;
   leagueID: string;
}) => {
   const [isLoading, setIsLoading] = useState(true);
   const [players, setPlayers] = useState<Player[]>([]);
   const [leagueScoring, setLeagueScoring] = useState<LeagueScoring | any>();
   const [league, setLeague] = useState<League | any>();
   const [sort, setSort] = useState<string>('');
   const [positionFilter, setPositionFilter] = useState<string>('');
   const [seasonFilter, setSeasonFilter] = useState<string>('');
   const [teamFilter, setTeamFilter] = useState<string>('');
   const [playerSearch, setPlayerSearch] = useState<string>('');
   const [season, setSeason] = useState<number>(1);
   const supabase = createClientComponentClient<Database>();

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
   useEffect(() => {
      const fetchPlayers = async () => {
         const data = await fetch(
            'https://mfiegmjwkqpipahwvcbz.supabase.co/storage/v1/object/sign/players/players.json?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwbGF5ZXJzL3BsYXllcnMuanNvbiIsImlhdCI6MTY5Mzk0MDgxOCwiZXhwIjoxNzI1NDc2ODE4fQ.jGh3wUFUMqnOUiSQ63pCXaOSoliqeYTH-N1qJIZx4-E&t=2023-09-05T19%3A06%3A58.178Z'
         );
         const players = await data.json();
         setPlayers(players);
         setIsLoading(false);
      };

      const fetchScoring = async () => {
         const { data } = await supabase
            .from('league_scoring')
            .select('*')
            .eq('id', league?.[0]?.league_scoring);
         setLeagueScoring(data?.[0] as LeagueScoring);
      };

      fetchPlayers();

      if (league) fetchScoring();
   }, [supabase, league]);

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
         if (teamFilter != '') {
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

      const playersBySeason = players.filter((player: Player) => {
         if (seasonFilter !== '') {
            // const season =
         }
      });

      if (sort != '') {
         return sortPlayers(playersSearched);
      } else {
         return playersSearched;
      }
   };

   const sortPlayers = (players: Player[]) => {
      players.sort((a: Player, b: Player) => {
         const statForA = getStatFromLastSeason(a.stats, sort);
         const statForB = getStatFromLastSeason(b.stats, sort);
         return statForB - statForA;
      });

      return players;
   };
   const getStatFromLastSeason = (player_stats: any, stat: string) => {
      if (!player_stats) {
         return 0;
      }

      if (!player_stats[season]['stats']) {
         return 0;
      }

      if (!player_stats[season]['stats'][stat]) {
         return 0;
      }

      return player_stats[season]['stats'][stat];
   };

   return (
      <>
         {!isLoading && (
            <div className="flex flex-col items-center w-full">
               <div className="flex flex-row justify-start self-start items-end">
                  <Filter values={positions} filterFun={setPositionFilter} />
                  <Filter values={teams} filterFun={setTeamFilter} />
                  <div className="flex flex-col">
                     <label htmlFor="season">Season:</label>
                     <select
                        className="text-black p-1 mr-2"
                        onChange={(e: ChangeEvent) => {
                           const target = e.target as HTMLSelectElement;
                           setSeason(Number(target?.value));
                        }}
                     >
                        <option value="0">2021-2022</option>
                        <option value="1" selected>
                           2022-2023
                        </option>
                     </select>
                  </div>
                  <input
                     className="text-black p-1"
                     type="text"
                     value={playerSearch}
                     onChange={(e) => setPlayerSearch(e.target.value)}
                  />
               </div>
               <div className=" w-full max-h-[75vh] overflow-y-scroll ">
                  <table className="w-full">
                     <thead className="w-full">
                        <tr className="dark:bg-gray-700 min-w-full text-left">
                           <th className="my-2" onClick={(e) => setSort('')}>
                              Name
                           </th>
                           <th className="my-2" onClick={(e) => setSort('')}>
                              Team
                           </th>
                           <th className="my-2" onClick={(e) => setSort('')}>
                              Pos
                           </th>
                           <th className="my-2" onClick={(e) => setSort('')}>
                              Score
                           </th>
                           <th className="my-2" onClick={(e) => setSort('')}>
                              Avg Score
                           </th>
                           <th className="my-2" onClick={(e) => setSort('')}>
                              GP
                           </th>
                           {positionFilter !== 'Goalie' ? (
                              <>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('')}
                                 >
                                    ATOI
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('goals')}
                                 >
                                    G
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('assists')}
                                 >
                                    A
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('plusMinus')}
                                 >
                                    +/-
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('shots')}
                                 >
                                    S
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('hits')}
                                 >
                                    H
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('blocked')}
                                 >
                                    B
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('pim')}
                                 >
                                    PIM
                                 </th>
                              </>
                           ) : (
                              <>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('wins')}
                                 >
                                    W
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('losses')}
                                 >
                                    L
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('saves')}
                                 >
                                    S
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('goalsAgainst')}
                                 >
                                    GA
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) =>
                                       setSort('goalAgainstAverage')
                                    }
                                 >
                                    GAA
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('shutouts')}
                                 >
                                    SO
                                 </th>
                              </>
                           )}
                        </tr>
                     </thead>
                     <tbody>
                        {leagueScoring &&
                           filterPlayers().map((player: Player) => {
                              return (
                                 <Player
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
         className="text-black p-1 mr-2"
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
