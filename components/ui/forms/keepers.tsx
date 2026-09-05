'use client';

import { RosterPlayer } from '@/app/leagues/[id]/keepers/page';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { isArray } from 'lodash';
import {
   ChangeEvent,
   FormEvent,
   MutableRefObject,
   useEffect,
   useRef,
   useState,
} from 'react';
import Featured from '../draft/components/featured-player/featured-player';
import { cleanSeasons, seasons } from '../draft/components/player-list';
import { buttonClasses } from '../helpers/buttons';

export interface KeeperFormProps {
   team: Team;
   userPicks: number[];
   roster: RosterPlayer[];
   players: Player[];
   numberOfRounds: number;
   numberOfTeams: number;
   draft: Draft;
}
const KeeperForm = ({
   team,
   userPicks,
   roster,
   players,
   numberOfRounds,
   numberOfTeams,
   draft,
}: KeeperFormProps) => {
   const supabase = createClientComponentClient<Database>();
   const picks = userPicks.map((pick: number) => {
      return Math.ceil(pick / numberOfTeams);
   });
   const [picksAvailable, setPicksAvailable] = useState<number[]>(
      userPicks.map((pick: number) => {
         return Math.ceil(pick / numberOfTeams);
      })
   );
   const [rosterState, setRosterState] = useState<RosterPlayer[]>(roster);
   const [submitted, setSubmitted] = useState<boolean>(false);
   const [modalOpen, setModalOpen] = useState<boolean>(false);
   const [modalPlayer, setModalPlayer] = useState<Player>();
   const playerModalRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
   const successModalRef: MutableRefObject<HTMLDivElement | null> =
      useRef(null);

   useEffect(() => {
      const picksUsed: number[] = [];
      for (const player of roster) {
         const { picks_used } = player;
         if (picks_used && picks_used.length) {
            for (const pick of picks_used) picksUsed.push(pick);
         }
      }
      setPicksAvailable(
         picksAvailable.filter((pick) => !picksUsed.includes(pick))
      );
   }, [roster]);

   const findClosestPick = (picks: number[]) => {
      let availablePicks = picksAvailable;
      let closest: number[] = [];
      closest = picks
         .sort((a, b) => b - a)
         .map((pick) => {
            const closestPick =
               availablePicks.sort((a, b) => b - a).find((x) => x <= pick) ?? 0;
            availablePicks = availablePicks.filter(
               (pick) => pick !== closestPick
            );

            return closestPick;
         });
      return closest;
   };
   const handleSetKeeper = (
      { target }: ChangeEvent<HTMLInputElement>,
      player: RosterPlayer
   ) => {
      let availablePicks = picksAvailable;
      const { picks_needed, picks_used } = player;
      if (target.checked) {
         const picks: number[] = findClosestPick(picks_needed).sort(
            (a, b) => a - b
         );

         availablePicks = availablePicks.filter(
            (pick) => !picks.includes(pick)
         );
         setRosterState(
            rosterState.map((rosterPlayer) => {
               if (rosterPlayer.draft_position === 1) {
               }
               if (rosterPlayer.player_id === player.player_id) {
                  return {
                     ...rosterPlayer,
                     picks_used: picks,
                     is_keeper: !rosterPlayer.is_keeper,
                  };
               }
               return {
                  ...rosterPlayer,
               };
            })
         );
      }
      if (!target.checked) {
         if (isArray(picks_used)) {
            availablePicks = [...availablePicks, ...picks_used];
         } else {
            availablePicks = [...availablePicks, picks_used];
         }
         setRosterState(
            rosterState.map((rosterPlayer) => {
               if (rosterPlayer.player_id === player.player_id) {
                  return {
                     ...rosterPlayer,
                     picks_used: [],
                     is_keeper: !rosterPlayer.is_keeper,
                  };
               }
               return {
                  ...rosterPlayer,
               };
            })
         );
      }
      setPicksAvailable(availablePicks);
   };

   const showPlayerModal = (player: Player) => {
      setModalOpen(true);
      setModalPlayer(player);
   };

   useEffect(() => {
      const handleKeyDownPlayerModal = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            setModalOpen(false);
         }
      };
      const handleKeyDownSuccessModal = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            setSubmitted(false);
         }
      };
      if (modalOpen) {
         playerModalRef.current && playerModalRef.current.focus();
         window.addEventListener('keydown', handleKeyDownPlayerModal);
      }
      if (submitted) {
         if (modalOpen) {
            setModalOpen(false);
         }
         successModalRef.current && successModalRef.current.focus();
         window.addEventListener('keydown', handleKeyDownSuccessModal);
      }
      return () => {
         window.removeEventListener('keydown', handleKeyDownPlayerModal);
         window.removeEventListener('keydown', handleKeyDownSuccessModal);
      };
   }, [modalOpen, submitted]);

   const playerModal = () => {
      if (!modalPlayer) return;
      return (
         <div
            ref={playerModalRef}
            autoFocus={true}
            tabIndex={0}
            className={
               'z-100 bg-gray-primary text-white left-1/2 translate-x-[-50%] fixed top-[15%] lg:top-[10%] max-w-2xl w-[95%] lg:w-full min-w-96 h-fit p-5 drop-shadow-lg'
            }
         >
            <div className="relative">
               <Featured
                  featuredPlayer={modalPlayer}
                  handleClose={() => setModalOpen(false)}
               />
            </div>
         </div>
      );
   };
   const submitKeepers = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (draft?.is_active || draft?.is_completed) return;
      rosterState.map(async (player) => {
         if (player.player_id && player.is_keeper) {
            const { error: draftSelectionsError } = await supabase
               .from('draft_selections')
               .upsert(
                  {
                     player_id: player.player_id,
                     draft_id: draft.id,
                     team_id: player.team_id,
                     pick: userPicks[player.picks_used[0] - 1],
                     round: player.picks_used[0],
                     is_keeper: player.is_keeper,
                     picks_used: player.picks_used,
                  },
                  {
                     onConflict: 'pick, draft_id',
                  }
               )
               .select();

            console.log(draftSelectionsError);

            const { error: teamHistoryError } = await supabase
               .from('team_history')
               .update({ is_keeper: true })
               .match({
                  player_id: player.player_id,
                  team_id: team.id,
               });
            if (!draftSelectionsError && !teamHistoryError) {
               setSubmitted(true);
            } else {
               setSubmitted(false);
            }
         } else {
            const { error: draftSelectionsError } = await supabase
               .from('draft_selections')
               .delete()
               .match({
                  player_id: player.player_id,
                  draft_id: draft.id,
               });
            const { error: teamHistoryError } = await supabase
               .from('team_history')
               .update({ is_keeper: false })
               .match({
                  player_id: player.player_id,
                  team_id: team.id,
               });
            if (!draftSelectionsError && !teamHistoryError) {
               setSubmitted(true);
            } else {
               setSubmitted(false);
            }
         }
      });
   };

   return (
      <>
         <form
            className={'flex flex-col mt-2 overflow-scroll lg:overflow-auto'}
            onSubmit={submitKeepers}
         >
            <table>
               <thead className="bg-emerald-primary">
                  <tr className={'align-bottom text-left'}>
                     <th
                        className={
                           'w-[40px] text-sm lg:text-normal p-0.5 lg:p-2'
                        }
                     >
                        Keep?
                     </th>
                     <th
                        className={
                           'w-[40px] text-sm lg:text-normal p-0.5 lg:p-2'
                        }
                     >
                        Pos
                     </th>
                     <th className="text-sm lg:text-normal p-0.5 lg:p-2">
                        Player
                     </th>
                     <th className="text-sm lg:text-normal p-0.5 lg:p-2">
                        Avg. Points
                     </th>
                     <th className="w-2 lg:w-[20px] text-sm lg:text-normal p-0.5 lg:p-2">
                        Drafted
                     </th>
                     <th className="text-sm lg:text-normal p-0.5 lg:p-2">
                        Pick(s) Used
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {rosterState
                     .sort(
                        (a, b) =>
                           (a?.draft_position ?? numberOfRounds + 1) -
                           (b?.draft_position ?? numberOfRounds + 1)
                     )
                     .map((player: RosterPlayer, index: number) => {
                        const playerData: Player | any = players.find(
                           (playerToMatch) => {
                              return playerToMatch.id === player.player_id;
                           }
                        );

                        const closestPick = player?.picks_used?.length
                           ? player.picks_used
                           : findClosestPick(player.picks_needed);

                        const canKeep =
                           closestPick.length > 1
                              ? closestPick.filter(
                                   (pick) => !picksAvailable.includes(pick)
                                ).length ||
                                picksAvailable.length < closestPick.length ||
                                closestPick.includes(0)
                                 ? true
                                 : false
                              : false;

                        if (!playerData) return <></>;

                        const isDisabled =
                           (closestPick.length === 0 ||
                              closestPick[closestPick.length - 1] === 0 ||
                              canKeep ||
                              !picksAvailable.includes(closestPick[0])) &&
                           !player.is_keeper;
                        return (
                           <tr
                              key={player.player_id}
                              className={classNames(
                                 isDisabled &&
                                    'line-through dark:decoration-red-600 decoration-2 !opacity-60'
                              )}
                           >
                              <td className="text-sm lg:text-normal p-0.5 lg:p-2">
                                 <input
                                    className={'w-[40px] h-[20px] align-middle'}
                                    type="checkbox"
                                    id={`keep-player-${player.player_id}-checkbox`}
                                    defaultChecked={player.is_keeper ?? false}
                                    disabled={isDisabled}
                                    onChange={(
                                       e: ChangeEvent<HTMLInputElement>
                                    ) => handleSetKeeper(e, player)}
                                 />
                              </td>
                              <td
                                 className={
                                    'w-[40px] text-sm lg:text-normal p-0.5 lg:p-2'
                                 }
                              >
                                 <label
                                    htmlFor={`keep-player-${player.player_id}-checkbox`}
                                 >
                                    {playerData?.primary_position}
                                 </label>
                              </td>
                              <td className="text-sm lg:text-normal p-0.5 lg:p-2">
                                 <span className="flex h-full items-center justify-start">
                                    <label
                                       className="mr-2"
                                       htmlFor={`keep-player-${player.player_id}-checkbox`}
                                    >
                                       {playerData?.first_name}{' '}
                                       {playerData?.last_name}
                                    </label>
                                    <button
                                       className="hidden lg:inline-flex items-center leading-3 ml-auto bg-gray-light text-black p-1 h-fit text-left hover:text-gray-300 transition-all duration-100"
                                       type="button"
                                       onClick={() =>
                                          showPlayerModal(playerData)
                                       }
                                       title="Show detailed stats"
                                    >
                                       =
                                    </button>
                                 </span>
                              </td>
                              <td className="text-sm lg:text-normal p-0.5 lg:p-2">
                                 {playerData?.stats?.[cleanSeasons(seasons[2])]
                                    ?.averageScore ?? 'NA'}
                              </td>
                              <td className="text-sm lg:text-normal p-0.5 lg:p-2">
                                 {player.draft_position ?? 'FA'}
                              </td>
                              <td className="text-sm lg:text-normal p-0.5 lg:p-2">
                                 <div className="min-w-8 flex justify-center text-left max-w-28 w-fit bg-gray-light p-1">
                                    <span className="w-fit">
                                       {closestPick
                                          .sort((a, b) => a - b)
                                          .filter((pick) => pick !== 0)
                                          .map((pick, index) => {
                                             if (closestPick.length > 1) {
                                                if (
                                                   index ===
                                                   closestPick.length - 1
                                                ) {
                                                   return pick;
                                                }
                                                return `${pick}, `;
                                             }
                                             return pick;
                                          })}
                                    </span>
                                 </div>
                                 <select
                                    className="text-black hidden"
                                    value={
                                       player.is_keeper &&
                                       player.picks_used?.[0]
                                          ? player.picks_used[0]
                                          : closestPick[0]
                                    }
                                    disabled={true}
                                 >
                                    {picks
                                       .filter((pick) => {
                                          if (!player.draft_position) {
                                             return pick;
                                          }
                                          return player.draft_position === 1
                                             ? player.draft_position === pick
                                             : player.draft_position - 1 >=
                                                  pick;
                                       })
                                       .map((pick) => {
                                          return (
                                             <option
                                                key={`${player.player_id}${pick}`}
                                             >
                                                {player?.picks_used?.length > 1
                                                   ? player.picks_used.map(
                                                        (pickUsed, index) => {
                                                           if (
                                                              index ===
                                                              player.picks_used
                                                                 .length -
                                                                 1
                                                           ) {
                                                              return pickUsed;
                                                           } else if (
                                                              player
                                                                 .picks_needed
                                                                 .length ===
                                                                 numberOfRounds &&
                                                              index === 0
                                                           ) {
                                                              return `${pickUsed}-`;
                                                           } else if (
                                                              index === 0
                                                           ) {
                                                              return `${pickUsed}, `;
                                                           } else if (
                                                              index === 1 &&
                                                              player
                                                                 .picks_needed
                                                                 .length !==
                                                                 numberOfRounds
                                                           ) {
                                                              return `${pickUsed}-`;
                                                           }
                                                           return;
                                                        }
                                                     )
                                                   : closestPick?.length > 1
                                                   ? closestPick
                                                        .sort((a, b) => a - b)
                                                        .map(
                                                           (
                                                              pickUsed,
                                                              index
                                                           ) => {
                                                              if (
                                                                 index ===
                                                                 closestPick.length -
                                                                    1
                                                              ) {
                                                                 return pickUsed;
                                                              } else if (
                                                                 closestPick.length ===
                                                                    numberOfRounds &&
                                                                 index === 0
                                                              ) {
                                                                 return `${pickUsed}, `;
                                                              } else if (
                                                                 index === 0
                                                              ) {
                                                                 return `${pickUsed}, `;
                                                              } else if (
                                                                 index === 1 &&
                                                                 closestPick.length !==
                                                                    numberOfRounds
                                                              ) {
                                                                 return `${pickUsed}, `;
                                                              }
                                                              return `${pickUsed}, `;
                                                           }
                                                        )
                                                   : pick}
                                             </option>
                                          );
                                       })}
                                 </select>
                              </td>
                           </tr>
                        );
                     })}
               </tbody>
            </table>
            <button
               className={classNames(buttonClasses, 'w-36 mx-auto my-5')}
               type="submit"
               disabled={(draft?.is_active || draft?.is_completed) ?? false}
            >
               Submit Keepers
            </button>
         </form>
         {modalOpen && playerModal()}
         {submitted && (
            <div
               ref={successModalRef}
               autoFocus={true}
               tabIndex={0}
               className={
                  'z-100 bg-gray-primary text-white left-1/2 translate-x-[-50%] fixed top-[45%] max-w-2xl w-[95%] lg:w-full min-w-96 h-fit p-5 drop-shadow-lg'
               }
            >
               <div className="relative p-5">
                  <h1 className="text-center mx-5">
                     Keepers successfully submitted
                  </h1>
                  <button
                     className="absolute top-0 right-0"
                     type="button"
                     onClick={() => setSubmitted(false)}
                  >
                     X
                  </button>
               </div>
            </div>
         )}
      </>
   );
};

export default KeeperForm;
