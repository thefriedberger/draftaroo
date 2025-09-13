'use client';

import { buildThresholdList } from '@/app/utils/helpers';
import PlayerComponentSkeleton from '@/components/ui/draft/skeletons/player-card';
import { SortValue, teams } from '@/lib/constants';
import { PlayerListProps, PlayerStats } from '@/lib/types';
import classNames from 'classnames';
import { ChangeEvent, Suspense, useEffect, useState } from 'react';
import PlayerComponent from '../player';
import PlayerObserver from './observer';

export const positions = ['Skaters', 'G', 'Forwards', 'C', 'L', 'R', 'D'];
export const positionMap = {
   Skaters: 'Skaters',
   G: 'Goalies',
   Forwards: 'Forwards',
   C: 'Center',
   L: 'Left Wing',
   R: 'Right Wing',
   D: 'Defender',
};
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
      return statForB - statForA;
   });

   return players;
};
const PlayerList = ({ league, players, draftedIds }: PlayerListProps) => {
   const [sort, setSort] = useState<SortValue>('score');
   const [positionFilter, setPositionFilter] = useState<string>('Skaters');
   const [teamFilter, setTeamFilter] = useState<string>('Team');
   const [playerSearch, setPlayerSearch] = useState<string>('');
   const [season, setSeason] = useState<number>(2);
   const [records, setRecords] = useState<number>(150);
   const [minGP, setMinGP] = useState<number | ''>('');
   const thClasses = classNames('p-2 lg:p-1 my-2 cursor-pointer');

   const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '50px',
      threshold: buildThresholdList,
   };

   const { playersRef, isVisible } = PlayerObserver(options);
   const seasons = ['Season', '2022-2023', '2023-2024'];

   useEffect(() => {
      if (isVisible) setRecords(records + 150);
   }, [isVisible]);

   useEffect(() => {
      filterPlayers();
   }, [players]);

   const filterPlayers = () => {
      const playersByPostion = players
         .filter((player: Player) => !draftedIds.includes(player.id))
         .filter((player: Player) => {
            if (positionFilter === 'Skaters')
               return player.primary_position !== 'G';
            if (positionFilter === 'Forwards')
               if (player.primary_position)
                  return ['C', 'L', 'R'].includes(player.primary_position);
            if (positionFilter !== '') {
               return player.primary_position === positionFilter;
            } else {
               return true;
            }
         });

      const playersByTeam = playersByPostion.filter((player: Player) => {
         if (teamFilter !== 'Team') {
            return player.current_team === teamFilter;
         } else {
            return true;
         }
      }, []);

      const playersByGP = playersByTeam.filter((player) => {
         const currentStats = player.stats?.[season] as PlayerStats;
         if (!minGP) {
            return true;
         }
         if (currentStats && currentStats.stats?.games) {
            return currentStats.stats.games >= minGP;
         }
         return false;
      });

      const playersSearched = playersByGP.filter((player: Player) => {
         if (playerSearch !== '') {
            const fullName = player.first_name + ' ' + player.last_name;
            return fullName.toLowerCase().includes(playerSearch.toLowerCase());
         } else {
            return true;
         }
      });

      if (sort !== '') {
         return sortPlayers(playersSearched, sort, season);
      } else {
         return playersSearched;
      }
   };

   useEffect(() => {
      setRecords(150);
   }, [sort, minGP]);

   return (
      <>
         <div className="flex flex-col items-center h-full max-h-full w-full text-black dark:text-white">
            <div className="flex flex-col sticky top-0 z-10 bg-gray-primary lg:z-0 lg:bg-transparent lg:static lg:flex-row w-full lg:w-auto justify-start self-start items-stretch lg:items-end">
               <div className="grid grid-cols-3 lg:grid-cols-5">
                  <Filter
                     values={positions}
                     labels={positionMap}
                     filterFun={setPositionFilter}
                     name={'Filter positions'}
                  />
                  <Filter
                     values={teams}
                     filterFun={setTeamFilter}
                     name={'Filter teams'}
                  />
                  <div className="flex flex-col">
                     <select
                        defaultValue={'2'}
                        className="text-black p-2 rounded-none lg:p-1 lg:mr-2"
                        onChange={(e: ChangeEvent) => {
                           const target = e.target as HTMLSelectElement;
                           setSeason(Number(target?.value));
                        }}
                        name={'Change season'}
                     >
                        <option value="0">2022-2023</option>
                        <option value="1">2023-2024</option>
                        <option value="2">2024-2025</option>
                        {/* <option value="3">2025-2026 (proj.)</option> */}
                     </select>
                  </div>
                  <input
                     className="text-black p-2 col-span-2 lg:col-span-1 lg:p-1 lg:mr-2"
                     type="search"
                     name="Player search"
                     aria-label="Player search"
                     placeholder="Search players"
                     value={playerSearch}
                     onChange={(e) => setPlayerSearch(e.target.value)}
                  />
                  <div className="flex flex-row ml-auto col-span-1 w-full lg:ml-0 bg-white dark:bg-transparent lg:bg-transparent">
                     <label
                        htmlFor="min-gp"
                        className="h-full border-r text-black lg:text-inherit bg-white lg:bg-transparent lg:border-r-0 self-end pt-2 pr-1 min-w-16 text-right w-full lg:w-auto"
                     >
                        Min GP:
                     </label>
                     <input
                        type="number"
                        id={'min-gp'}
                        className="h-full w-full lg:w-8 text-black p-2 lg:p-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e) =>
                           e.target.value.length
                              ? setMinGP(Number(e.target.value))
                              : setMinGP('')
                        }
                        value={minGP}
                     />
                  </div>
               </div>
            </div>
            <div
               className=" w-full lg:h-full overflow-y-scroll relative"
               id={'player-list-container'}
            >
               <table
                  className="w-full text-sm relative overflow-y-scroll"
                  id={'player-list-table'}
               >
                  <thead className="w-full sticky top-0">
                     <tr className="bg-gray-700 text-white dark:bg-gold min-w-full text-left">
                        <th></th>
                        <th className={thClasses} onClick={(e) => setSort('')}>
                           Name
                        </th>
                        <th
                           className={thClasses}
                           onClick={(e) => setSort('score')}
                        >
                           Score
                        </th>
                        <th
                           className={thClasses}
                           onClick={(e) => setSort('averageScore')}
                        >
                           Avg
                        </th>
                        <th
                           className={thClasses}
                           onClick={(e) => setSort('games')}
                        >
                           GP
                        </th>
                        {positionFilter !== 'G' ? (
                           <>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('timeOnIcePerGame')}
                              >
                                 ATOI
                              </th>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('goals')}
                              >
                                 G
                              </th>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('assists')}
                              >
                                 A
                              </th>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('pim')}
                              >
                                 PIM
                              </th>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('powerPlayGoals')}
                              >
                                 PPG
                              </th>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('powerPlayAssists')}
                              >
                                 PPA
                              </th>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('shortHandedGoals')}
                              >
                                 SHG
                              </th>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('shortHandedAssists')}
                              >
                                 SHA
                              </th>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('shots')}
                              >
                                 SOG
                              </th>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('hits')}
                              >
                                 HIT
                              </th>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('blocked')}
                              >
                                 BLK
                              </th>
                           </>
                        ) : (
                           <>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('wins')}
                              >
                                 W
                              </th>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('losses')}
                              >
                                 L
                              </th>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('saves')}
                              >
                                 S
                              </th>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('goalsAgainst')}
                              >
                                 GA
                              </th>
                              <th
                                 className={thClasses}
                                 onClick={(e) => setSort('goalAgainstAverage')}
                              >
                                 GAA
                              </th>
                              <th
                                 className={thClasses}
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
                        filterPlayers()
                           .slice(0, records)
                           .map((player: Player) => {
                              return (
                                 <Suspense
                                    key={player.id}
                                    fallback={<PlayerComponentSkeleton />}
                                 >
                                    <PlayerComponent
                                       key={player.id}
                                       player={player}
                                       season={season}
                                       sort={sort}
                                    />
                                 </Suspense>
                              );
                           })}

                     <tr ref={playersRef}>
                        {records >= 150 && records < filterPlayers().length && (
                           <td>Loading...</td>
                        )}
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </>
   );
};

const Filter = ({ values, labels, filterFun, name }: any) => {
   return (
      <select
         onChange={(e) => filterFun(e.target.value)}
         className="text-black rounded-none p-2 lg:p-1 lg:mr-2"
         name={name}
      >
         {values.map((x: any) => {
            return (
               <option key={x} value={x}>
                  {labels?.[x] ?? x}
               </option>
            );
         })}
      </select>
   );
};

export default PlayerList;
