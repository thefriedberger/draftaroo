'use client';

import KeeperIcon from '@/app/assets/images/icons/keeper-icon';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';

export type SortType = 'Round' | 'Team';

interface RoundView {
   [round: number]: DraftSelection[] | null;
}
interface TeamView {
   [team: number]: DraftSelection[];
}

const DraftResults = ({
   draftResults,
   leagueRules,
   teams,
   players,
}: {
   draftResults: DraftSelection[];
   leagueRules: LeagueRules;
   teams: Team[];
   players: Player[];
}) => {
   const [results, setResults] = useState<any[]>([]);
   const [sortType, setSortType] = useState<SortType>('Round');
   const buttonClass =
      'w-24 bg-emerald-primary hover:bg-emerald-500 text-white text-md font-bold p-2';

   const updateDraftDisplay = useCallback(() => {
      switch (sortType) {
         case 'Round': {
            const roundView = Array.from({
               length: leagueRules.number_of_rounds,
            }).map((v, k) => {
               const picks: DraftSelection[] = [];
               for (const result of draftResults) {
                  if (result.round === k + 1) {
                     picks.push(result);
                  }
               }
               return picks;
            });
            setResults(roundView);
            break;
         }
         case 'Team': {
            const teamView = Array.from({
               length: leagueRules.number_of_teams,
            }).map((v, k) => {
               const picks: DraftSelection[] = [];
               for (const result of draftResults) {
                  if (result.team_id === teams[k].id) {
                     picks.push(result);
                  }
               }
               return picks;
            });
            setResults(teamView);
            break;
         }
      }
   }, [
      sortType,
      leagueRules.number_of_rounds,
      leagueRules.number_of_teams,
      draftResults,
      teams,
   ]);
   useEffect(() => {
      updateDraftDisplay();
   }, [sortType, updateDraftDisplay]);

   return (
      <>
         <div className="flex flex-col mt-5 lg:mx-0 w-full">
            <div className="flex flex-row flex-wrap justify-center">
               <div className="flex flex-row flex-1 pl-2 lg:pl-8 min-w-full">
                  <button
                     className={classNames(buttonClass)}
                     type="button"
                     onClick={() => setSortType('Round')}
                  >
                     By Round
                  </button>
                  <button
                     className={classNames(buttonClass)}
                     type="button"
                     onClick={() => setSortType('Team')}
                  >
                     By Team
                  </button>
               </div>
               {results.map((result: DraftSelection[], k: number) => {
                  return (
                     <div
                        key={k}
                        className="flex-1 w-full md:min-w-[46%]  md:max-w-[46%] lg:min-w-[30%] lg:max-w-[30%] mx-2 my-5"
                     >
                        <h3 className="text-white text-md w-full p-1 bg-emerald-primary">
                           {sortType === 'Round'
                              ? `Round ${k + 1}:`
                              : `${teams?.[k]?.team_name}`}
                        </h3>
                        <table className="w-full">
                           {result
                              .sort((a, b) => a.pick - b.pick)
                              .map((pick: DraftSelection, index: number) => {
                                 const team = teams.find(
                                    (toFind) => toFind.id === pick.team_id
                                 );
                                 const player = players.find(
                                    (toFind) => toFind.id === pick.player_id
                                 );
                                 return (
                                    <tr key={player?.id}>
                                       <td>{index + 1}.</td>
                                       <td className="min-w-fit whitespace-nowrap">
                                          ({pick.pick}) {player?.first_name}{' '}
                                          {player?.last_name}
                                       </td>
                                       <td className="text-ellipsis max-w-32 text-nowrap overflow-hidden">
                                          {sortType === 'Round' &&
                                             team?.team_name}
                                       </td>
                                       <td className="min-w-[15px]">
                                          {pick.is_keeper && <KeeperIcon />}
                                       </td>
                                    </tr>
                                 );
                              })}
                        </table>
                     </div>
                  );
               })}
            </div>
         </div>
      </>
   );
};

export default DraftResults;
