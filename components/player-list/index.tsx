'use client';

import getPlayers from '@/utils/get-players';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { PageContext } from '../context/page-context';
import PlayerComponent from '../player';

const PlayerList = ({
   updateFeaturedPlayer,
   leagueID,
   draftedPlayers,
}: {
   updateFeaturedPlayer: (player: Player | any) => void;
   leagueID: string;
   draftedPlayers: number[];
}) => {
   const [isLoading, setIsLoading] = useState(true);
   const [players, setPlayers] = useState<Player[]>([]);
   const [leagueScoring, setLeagueScoring] = useState<LeagueScoring | any>();
   const [league, setLeague] = useState<League | any>();
   const [sort, setSort] = useState<string>('');
   const [positionFilter, setPositionFilter] = useState<string>('Skaters');
   const [teamFilter, setTeamFilter] = useState<string>('Team');
   const [playerSearch, setPlayerSearch] = useState<string>('');
   const [season, setSeason] = useState<number>(1);
   const [shouldGetPlayerPoints, setShouldGetPlayerPoints] =
      useState<boolean>(true);
   const supabase = createClientComponentClient<Database>();

   useEffect(() => {
      const fetchPlayers = async () => {
         const playersArray = await getPlayers(leagueID);
         setPlayers(playersArray as Player[]);
         setIsLoading(false);
      };
      fetchPlayers();
   }, []);

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
         return sortPlayers(playersSearched);
      } else {
         return playersSearched;
      }
   };

   const filterDraftedPlayers = () => {
      const updatedPlayers: Player[] = players.filter((player: Player) => {
         return !draftedPlayers.includes(player.id);
      });
      setPlayers(updatedPlayers);
   };

   useEffect(() => {
      !shouldGetPlayerPoints && filterDraftedPlayers();
   }, [draftedPlayers]);

   const sortPlayers = (players: Player[]) => {
      players.sort((a: Player, b: Player) => {
         const statForA = getStatFromLastSeason(a.stats, sort);
         const statForB = getStatFromLastSeason(b.stats, sort);
         return statForB - statForA;
      });

      return players;
   };

   //    const getPlayerPoints = async () => {
   //       if (players.length > 0 && leagueScoring !== undefined) {
   //          players.forEach((player: Player) => {
   //             const playerStats = player?.stats as PlayerStats[];
   //             if (playerStats?.[season] !== undefined) {
   //                const { stats } = playerStats?.[season];
   //                let tempPoints: number = 0;
   //                for (const key in stats) {
   //                   const stat = key as keyof PlayerStats;
   //                   if (
   //                      (leagueScoring?.[stat] !== undefined ||
   //                         leagueScoring?.[stat]) &&
   //                      (stats?.[key] || null !== undefined || stats?.[key])
   //                   ) {
   //                      if (key === 'powerPlayPoints') {
   //                         tempPoints +=
   //                            leagueScoring?.['powerPlayAssists'] *
   //                            (stats?.['powerPlayPoints'] ||
   //                               0 - (stats?.['powerPlayGoals'] || 0));
   //                      } else if (key === 'shortHandedPoints') {
   //                         tempPoints +=
   //                            leagueScoring?.['shortHandedAssists'] *
   //                            (stats?.['shortHandedPoints'] ||
   //                               0 - (stats?.['shortHandedGoals'] || 0));
   //                      } else {
   //                         tempPoints += leagueScoring?.[stat] * stats?.[stat];
   //                      }
   //                   }
   //                }

   //                if (stats && tempPoints > 0) {
   //                   stats.score = Math.round(tempPoints * 100) / 100;
   //                   stats.averageScore =
   //                      Math.round((tempPoints / (stats?.games || 1)) * 100) / 100;
   //                }
   //                setPlayers((prev) => [...prev, player]);
   //             }
   //          });
   //          return true;
   //       }
   //       return false;
   //    };

   //    useEffect(() => {
   //       const setPoints = async () => {
   //          const pointsReady = await getPlayerPoints();
   //          if (pointsReady) {
   //             setShouldGetPlayerPoints(false);
   //             setIsLoading(false);
   //          } else {
   //             setShouldGetPlayerPoints(true);
   //             setIsLoading(true);
   //          }
   //       };
   //       shouldGetPlayerPoints && setPoints();
   //    }, [players, leagueScoring]);

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

   useEffect(() => {}, [leagueScoring, season]);
   return (
      <>
         {!isLoading && (
            <div className="flex flex-col items-center md:h-[75vh] w-full">
               <div className="flex flex-row justify-start self-start items-end">
                  <Filter values={positions} filterFun={setPositionFilter} />
                  <Filter values={teams} filterFun={setTeamFilter} />
                  <div className="flex flex-col">
                     <label htmlFor="season">Season:</label>
                     <select
                        defaultValue={1}
                        className="text-black p-1 mr-2"
                        onChange={(e: ChangeEvent) => {
                           const target = e.target as HTMLSelectElement;
                           setSeason(Number(target?.value));
                        }}
                     >
                        <option value="0">2021-2022</option>
                        <option value="1">2022-2023</option>
                     </select>
                  </div>
                  <input
                     className="text-black p-1"
                     type="text"
                     value={playerSearch}
                     onChange={(e) => setPlayerSearch(e.target.value)}
                  />
               </div>
               <div className=" w-full max-h-[75vh] overflow-y-scroll relative">
                  <table className="w-full text-sm">
                     <thead className="w-full">
                        <tr className="bg-gray-700 text-white dark:bg-gold min-w-full text-left">
                           <th></th>
                           <th className="my-2" onClick={(e) => setSort('')}>
                              Name
                           </th>
                           <th
                              className="my-2"
                              onClick={(e) => setSort('score')}
                           >
                              Score
                           </th>
                           <th
                              className="my-2"
                              onClick={(e) => setSort('averageScore')}
                           >
                              Avg Score
                           </th>
                           <th
                              className="my-2"
                              onClick={(e) => setSort('games')}
                           >
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
                                    onClick={(e) => setSort('pim')}
                                 >
                                    PIM
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('powerPlayGoals')}
                                 >
                                    PPG
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('powerPlayAssists')}
                                 >
                                    PPA
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('shortHandedGoals')}
                                 >
                                    SHG
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) =>
                                       setSort('shortHandedAssists')
                                    }
                                 >
                                    SHA
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('shots')}
                                 >
                                    SOG
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('hits')}
                                 >
                                    HIT
                                 </th>
                                 <th
                                    className="my-2"
                                    onClick={(e) => setSort('blocked')}
                                 >
                                    BLK
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
                        {players.length > 0 &&
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
