'use client';

import { DraftBoardIcon } from '@/app/assets/images/icons/draft-board';
import { DraftOrderIcon } from '@/app/assets/images/icons/draft-order';
import { MyTeamIcon } from '@/app/assets/images/icons/my-team';
import { TeamsIcon } from '@/app/assets/images/icons/teams';
import { WatchlistIcon } from '@/app/assets/images/icons/watchlist';
import getTime from '@/app/utils/get-time';
import {
   fetchOwnerByTeam,
   fetchWatchlist,
   handleDraftSelection,
   handlePick,
   setDraftCompleted,
   setMainTimer,
   updateSupabaseWatchlist,
} from '@/app/utils/helpers';
import { DraftContext } from '@/components/context/draft-context';
import { WatchlistAction } from '@/components/context/page-context';
import DraftOrderSkeleton from '@/components/skeletons/draft-order-skeleton';
import TimerSkeleton from '@/components/skeletons/timer-skeleton';
import {
   BoardProps,
   ChatProps,
   DraftOrderProps,
   DraftedPlayer,
   FeaturedPlayerProps,
   FeaturedPlayerType,
   MyTeamProps,
   PlayerListProps,
   Tab,
   TabProps,
   TeamsListProps,
   TimerProps,
   WatchlistProps,
} from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Chat from '../chat';
import DraftOrder from '../draft-order';
import FeaturedPlayer from '../featured-player';
import { buttonClasses } from '../helpers/buttons';
import MyTeam from '../my-team';
import PlayerList, { sortPlayers } from '../player-list';
import Tabs from '../tabs';
import TeamsList from '../teams-list';
import Timer from '../timer';
import Watchlist from '../watchlist';

const Board = ({
   league,
   draft,
   user,
   watchlist,
   draftPicks,
   players,
   team,
   teams,
   leagueRules,
   leagueScoring,
   draftedPlayers,
   timerDuration,
}: BoardProps) => {
   const supabase = createClientComponentClient<Database>();
   const isOwner = useRef(league.owner === user.id);
   const turnOrder = useRef(draftPicks);
   const numberOfRounds = useRef(leagueRules.number_of_rounds);
   const numberOfTeams = useRef(leagueRules.number_of_teams);
   const [isYourTurn, setIsYourTurn] = useState<boolean>(false);
   const [pickIsKeeper, setPickIsKeeper] = useState<boolean>(false);

   /*** Channels ***/
   const draftChannel = supabase.channel('draft-channel');
   const pickChannel = supabase.channel('pick-channel');
   const draftStatusChannel = supabase.channel('draft-is-active-channel');

   /*** States ***/
   const [featuredPlayer, setFeaturedPlayer] = useState<FeaturedPlayerType>();
   const [currentPick, setCurrentPick] = useState<number>(draft.current_pick);
   const [currentRound, setCurrentRound] = useState<number>(1);
   const [draftedPlayersState, setDraftedPlayersState] =
      useState<DraftSelection[]>(draftedPlayers);
   const [watchlistState, setWatchlistState] = useState<number[]>(
      watchlist?.players ?? []
   );
   const [isActive, setIsActive] = useState<boolean>(draft?.is_active);
   const [isCompleted, setIsCompleted] = useState<boolean>(
      draft?.is_completed ?? false
   );
   const [draftedIds, setdraftedIds] = useState<number[]>([]);
   const [yourPlayers, setYourPlayers] = useState<DraftedPlayer[]>([]);
   const [teamsViewPlayers, setTeamsViewPlayers] = useState<DraftedPlayer[]>(
      []
   );
   const [teamViewToShow, setTeamViewToShow] = useState<string>('');

   const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });

   const handleDraftSelectionProps = {
      supabase: supabase,
      currentPick: currentPick,
      currentRound: currentRound,
      draft: draft,
      teamId: team.id,
   };
   useEffect(() => {
      if (draftedPlayersState.length > 0) {
         for (const player of draftedPlayersState) {
            setdraftedIds((prev) => [...prev, Number(player.player_id)]);
         }
      }
   }, [draftedPlayersState]);

   // set my team and other teams players
   useEffect(() => {
      const tempPlayers = updateTeamsViewPlayers(team.id);

      const userPlayers: DraftedPlayer[] = players
         .filter((player) =>
            tempPlayers.map((player) => player.player_id).includes(player.id)
         )
         .map((player) => {
            const foundPlayer = tempPlayers.find(
               (tempPlayer) => tempPlayer.player_id === player.id
            );
            return {
               ...player,
               is_keeper: foundPlayer?.is_keeper ?? false,
               pick: foundPlayer?.pick ?? 23,
            };
         });
      setYourPlayers(userPlayers);

      // updateTeamsViewPlayers(team.id).forEach(
      //    (player: DraftSelection) =>
      //       player &&
      //       !yourPlayers.includes(player.player_id) &&
      //       setYourPlayers((prev) => [...prev, player.player_id])
      // );
      if (teamViewToShow !== '') {
         if (updateTeamsViewPlayers(teamViewToShow).length === 0) {
            setTeamsViewPlayers([]);
         } else {
            const otherPlayers = updateTeamsViewPlayers(teamViewToShow);

            const teamPlayers: DraftedPlayer[] = players
               .filter((player) =>
                  otherPlayers
                     .map((player) => player.player_id)
                     .includes(player.id)
               )
               .map((player) => {
                  const foundPlayer = otherPlayers.find(
                     (tempPlayer) => tempPlayer.player_id === player.id
                  );
                  return {
                     ...player,
                     is_keeper: foundPlayer?.is_keeper ?? false,
                     pick: foundPlayer?.pick ?? 23, // 23 should never populate here
                  };
               });
            setTeamsViewPlayers(teamPlayers);

            // let tempTeams: number[] = [];
            // updateTeamsViewPlayers(teamViewToShow).forEach(
            //    (player: DraftSelection) => {
            //       if (
            //          player.player_id &&
            //          !teamsViewPlayers.includes(player.player_id)
            //       ) {
            //          tempTeams.push(player.player_id);
            //       }
            //    }
            // );
            // setTeamsViewPlayers(
            //    updateTeamsViewPlayers(teamViewToShow).map(
            //       (player) => player.player_id
            //    )
            // );
         }
      }
   }, [draftedPlayersState, teamViewToShow]);

   // checking for keepers is handled here
   useEffect(() => {
      if (isActive && isOwner.current === true) {
         if (draftedPlayersState.length > 0) {
            for (const player of draftedPlayersState) {
               if (player.pick === currentPick && player.is_keeper) {
                  setTimeout(() => {
                     handlePick(supabase, draft, currentPick, timerDuration);
                  }, 500);
                  break;
               }
            }
         }
      }
   }, [isActive, draftedPlayersState, currentPick]);

   // set if user can pick
   useEffect(() => {
      const draftedPlayer = draftedPlayersState.find(
         (player) => player.pick === currentPick
      );

      setPickIsKeeper(draftedPlayer?.is_keeper ? true : false);
      setIsYourTurn(
         turnOrder.current
            .filter((turn) => turn.team_id === team.id)?.[0]
            ?.picks?.includes(currentPick)
      );

      if (
         isActive &&
         !turnOrder.current.filter((turn) => turn.team_id === team.id)[0].picks
            .length
      ) {
         const draftedPlayer = draftedPlayersState.filter(
            (player: DraftSelection) => {
               return player.pick === currentPick;
            }
         );
      }
   }, [turnOrder, team, currentPick, isActive, draftedPlayersState]);

   // set round
   useEffect(() => {
      if (numberOfTeams.current) {
         if (currentPick >= numberOfTeams.current) {
            setCurrentRound(Math.ceil(currentPick / numberOfTeams.current));
         } else {
            setCurrentRound(1);
         }
      }
   }, [currentPick, numberOfTeams]);

   // logic for updating after draft pick
   useEffect(() => {
      draftChannel
         .on(
            'postgres_changes',
            {
               event: 'INSERT',
               schema: 'public',
               table: 'draft_selections',
               filter: `draft_id=eq.${draft?.id}`,
            },
            (payload) => {
               setDraftedPlayersState((prev) => [
                  ...prev,
                  payload.new as DraftSelection,
               ]);
            }
         )
         .subscribe();

      pickChannel
         .on(
            'postgres_changes',
            {
               event: 'UPDATE',
               schema: 'public',
               table: 'draft',
               filter: `id=eq.${draft.id}`,
            },
            (payload) => {
               const numberOfPicks =
                  numberOfRounds.current &&
                  numberOfTeams.current &&
                  numberOfRounds.current * numberOfTeams.current;
               if (numberOfPicks && payload.new.current_pick > numberOfPicks) {
                  setDraftCompleted(supabase, draft);
               } else {
                  setCurrentPick(payload.new.current_pick);
               }
            }
         )
         .subscribe();

      return () => {
         if (isCompleted) {
            supabase.removeChannel(draftChannel);
            supabase.removeChannel(pickChannel);
         }
      };
   }, [supabase, draft, isCompleted]);

   useEffect(() => {
      draftStatusChannel
         .on(
            'postgres_changes',
            {
               event: '*',
               schema: 'public',
               table: 'draft',
               filter: `id=eq.${draft ? draft.id : ''}`,
            },
            (payload: any) => {
               setIsActive(payload.new.is_active);
               if (payload.new.is_completed === true) {
                  setIsCompleted(true);
               }
            }
         )
         .subscribe();

      return () => {
         if (isActive) {
            supabase.removeChannel(draftStatusChannel);
         }
      };
   }, [supabase, draft]);

   // TODO: make draft start a time based feature
   useEffect(() => {
      draft && setIsActive(draft.is_active);
   }, [draft]);

   useEffect(() => {
      filterDraftedPlayers();
      reorderWatchlist(
         watchlistState.filter((player) => !draftedIds.includes(player))
      );
   }, [draftedIds]);

   const updateFeaturedPlayer = useCallback(
      (player: FeaturedPlayerType, playerID?: number) => {
         if (playerID && players) {
            player =
               players.find((toSearch) => {
                  return toSearch.id === playerID;
               }) ?? null;
         }
         if (!player) setFeaturedPlayer(null);
         setFeaturedPlayer(player);
      },
      [players]
   );

   const startDraft = async () => {
      const serverTime = await getTime();
      setMainTimer(supabase, draft.id, serverTime + timerDuration * 1000);
      await supabase
         .from('draft')
         .update({ is_active: true })
         .match({ id: draft.id });
   };

   const stopDraft = async () => {
      await supabase
         .from('draft')
         .update({ is_active: false })
         .match({ id: draft.id });
   };
   const autoDraft = async () => {
      const autoDraftTeam = turnOrder.current.find((team) =>
         team.picks.includes(currentPick)
      );

      if (!autoDraftTeam) return;

      const teamOwner = await fetchOwnerByTeam(supabase, autoDraftTeam.team_id);
      const autoDraftWatchlist = await fetchWatchlist(
         supabase,
         teamOwner,
         draft
      );

      if (autoDraftWatchlist?.players?.length) {
         const autoDraftWatchlistPlayers = autoDraftWatchlist?.players.filter(
            (player) => !draftedIds.includes(player)
         );
         if (autoDraftWatchlistPlayers.length) {
            const watchlistPlayerToDraft: Player | null =
               players.find(
                  (player) => player.id === autoDraftWatchlistPlayers?.[0]
               ) ?? null;

            updateSupabaseWatchlist(
               supabase,
               autoDraftWatchlist.players.filter(
                  (player) => !draftedIds.includes(player)
               ),
               teamOwner,
               draft.id
            );

            if (watchlistPlayerToDraft) {
               handleDraftSelection({
                  ...handleDraftSelectionProps,
                  player: watchlistPlayerToDraft,
                  teamId: autoDraftTeam.team_id,
                  timerDuration,
               });
               return;
            }
         }
      }
      const playerIds: number[] = updateTeamsViewPlayers(
         autoDraftTeam.team_id
      ).map((player) => player.player_id);

      const teamPlayers: Player[] = players.filter((player) =>
         playerIds.includes(player.id)
      );

      const positionNeeded: string[] | null = findPositionsNeeded(teamPlayers);

      const positionPlayer =
         (positionNeeded &&
            sortPlayers(
               players.filter((player) => {
                  if (positionNeeded && player.primary_position) {
                     return (
                        positionNeeded.includes(player.primary_position) &&
                        !draftedIds.includes(player.id)
                     );
                  }
               }),
               'score',
               1
            )[0]) ||
         null;
      const bpa =
         sortPlayers(
            players.filter((player) => {
               return !draftedIds.includes(player.id);
            }),
            'score',
            1
         )[0] || null;
      const playerToDraft =
         positionPlayer && positionPlayer.primary_position === 'G'
            ? positionPlayer
            : sortPlayers(
                 positionPlayer
                    ? [bpa, positionPlayer]
                    : players.filter((player) => {
                         return !draftedIds.includes(player.id);
                      }),
                 'score',
                 1
              )[0] || null;

      if (!playerToDraft) return;
      handleDraftSelection({
         ...handleDraftSelectionProps,
         player: playerToDraft,
         teamId: autoDraftTeam.team_id,
         timerDuration,
      });
   };

   const findPositionsNeeded = (teamRoster: Player[]) => {
      const positionsMap = {
         forwards: 9,
         defensemen: 5,
         goalies: 2,
      }; // this should be updated along with all static position values
      let numberOfForwards = 0;
      let numberOfDefensemen = 0;
      let numberOfGoalies = 0;
      for (const player of teamRoster) {
         if (!player.primary_position) {
            continue;
         }

         if (['C', 'L', 'R'].includes(player.primary_position)) {
            numberOfForwards++;
            continue;
         }
         if (player.primary_position === 'D') {
            numberOfDefensemen++;
            continue;
         }
         if (player.primary_position === 'G') {
            numberOfGoalies++;
            continue;
         }
      }
      if (
         numberOfForwards >= Math.ceil(positionsMap.forwards / 2) &&
         numberOfDefensemen >= Math.ceil(positionsMap.defensemen / 2) &&
         numberOfGoalies === 0
      ) {
         return ['G'];
      }
      if (numberOfForwards <= positionsMap.forwards) {
         return ['C', 'L', 'R'];
      }
      if (numberOfDefensemen <= positionsMap.defensemen) {
         return ['D'];
      }
      if (numberOfGoalies <= positionsMap.goalies) {
         return ['G'];
      }
      return null;
   };

   const updateTeamsViewPlayers = (teamId: string) => {
      const teamPlayers =
         draftedPlayersState
            .filter((player: DraftSelection) => {
               return player.team_id === teamId;
            })
            ?.sort((a, b) => (a.pick < b.pick ? -1 : 1)) ?? [];
      return teamPlayers;
   };

   const updateWatchlist = (player: Player, action: WatchlistAction) => {
      if (watchlistState) {
         if (action === WatchlistAction.DELETE) {
            setWatchlistState(watchlistState?.filter((el) => el !== player.id));
         }
         if (action === WatchlistAction.ADD) {
            setWatchlistState((prev) => [...prev, player.id]);
         }
      }
   };

   const reorderWatchlist = (newWatchlist: number[]) => {
      setWatchlistState(newWatchlist);
   };

   useEffect(() => {
      updateSupabaseWatchlist(supabase, watchlistState, user?.id, draft.id);
   }, [watchlistState]);

   const filterDraftedPlayers = () => {
      players = players.filter((player: Player) => {
         return !draftedIds.includes(player.id);
      });
   };

   const timerProps: TimerProps = {
      owner: isOwner.current,
      currentPick: currentPick,
      currentRound: currentRound,
      isActive: isActive,
      autopick: autoDraft,
      yourTurn: isYourTurn,
      turnOrder: turnOrder.current,
      userTeam: team,
      isCompleted: isCompleted,
      draftId: draft.id,
      timerDuration,
      pickIsKeeper: pickIsKeeper,
   };

   const draftOrderProps: DraftOrderProps = {
      draftedPlayers: draftedPlayersState,
      currentPick: currentPick,
      teams: teams,
      isYourTurn: isYourTurn,
      turnOrder: turnOrder.current,
      league: league,
      players: players,
      teamID: team.id,
      numberOfRounds: numberOfRounds.current ?? 23,
   };

   const watchlistProps: WatchlistProps = {
      draftedIds: draftedIds,
      leagueID: league?.league_id ?? '',
      players: players,
   };

   const featuredPlayerProps: FeaturedPlayerProps = {
      draftedIds: draftedIds,
      featuredPlayer: featuredPlayer || null,
      yourTurn: isYourTurn,
      handleDraftSelectionProps: handleDraftSelectionProps,
      isActive: isActive,
      leagueScoring: leagueScoring,
      timerDuration: timerDuration,
   };

   const playerListProps: PlayerListProps = {
      league: league,
      draftedIds: draftedIds,
      players: players,
      leagueScoring: leagueScoring,
   };

   const myTeamProps: MyTeamProps = {
      draftedPlayers: yourPlayers,
   };

   const teamsViewProps: TeamsListProps = {
      draftedPlayers: teamsViewPlayers,
      setTeamsViewPlayers: setTeamViewToShow,
      teams: teams,
      user: user,
   };
   const tabs: Tab[] = [
      {
         tabButton: 'Draft Board',
         tabPane: <PlayerList {...playerListProps} />,
      },
      {
         tabButton: 'View Teams',
         tabPane: <TeamsList {...teamsViewProps} />,
      },
   ];
   const mobileTabs: Tab[] = [
      {
         tabButton: (
            <>
               <DraftBoardIcon />
               <p className="text-[8px]">Draft Board</p>
            </>
         ),
         tabPane: <PlayerList {...playerListProps} />,
      },
      {
         tabButton: (
            <>
               <DraftOrderIcon />
               <p className="text-[8px]">Draft Order</p>
            </>
         ),
         tabPane: <DraftOrder {...draftOrderProps} />,
      },
      {
         tabButton: (
            <>
               <WatchlistIcon />
               <p className="text-[8px]">Watchlist</p>
            </>
         ),
         tabPane: <Watchlist {...watchlistProps} />,
      },
      {
         tabButton: (
            <>
               <TeamsIcon />
               <p className="text-[8px]">Your Team</p>
            </>
         ),
         tabPane: <MyTeam {...myTeamProps} />,
      },
      {
         tabButton: (
            <>
               <MyTeamIcon />
               <p className="text-[8px]">Other Teams</p>
            </>
         ),
         tabPane: <TeamsList {...teamsViewProps} />,
      },
   ];
   const tabProps: TabProps = {
      tabs,
      centerTabs: false,
      className:
         'flex flex-col w-full lg:max-w-screen-xl lg:h-[65%] text-white',
      saveState: true,
   };

   const mobileTabProps: TabProps = {
      tabs: mobileTabs,
      centerTabs: false,
      className: `flex flex-col-reverse w-full h-[calc(100%-66px)] overflow-y-scroll ${
         featuredPlayer &&
         (!draftedIds.includes(featuredPlayer?.id) ? 'pb-[130px]' : 'pb-[90px]')
      }`,
      saveState: true,
      gridColumns: `grid-cols-5`,
   };

   const chatProps: ChatProps = {
      user: user,
   };
   return (
      <div className="flex flex-col lg:flex-row items-center w-full overflow-y-scroll lg:overflow-y-hidden draft-board">
         <DraftContext.Provider
            value={{
               watchlist: watchlistState,
               updateWatchlist,
               reorderWatchlist,
               updateFeaturedPlayer,
            }}
         >
            {user && team?.league_id === league.league_id && (
               <>
                  {isOwner.current &&
                     (!isCompleted ? (
                        <>
                           <button
                              onClick={autoDraft}
                              className={classNames(
                                 buttonClasses,
                                 'w-20 lg:w-32 h-10 !p-1 !lg:p-2 lg:z-[100] text-sm lg:text-lg absolute top-2 right-[calc(25%-4.5rem)] lg:right-[calc(25%-130px)] xl:right-[calc(30%-130px)] z-[100]'
                              )}
                           >
                              Auto Draft
                           </button>
                           <button
                              className={classNames(
                                 buttonClasses,
                                 'w-20 lg:w-32 h-10 !p-1 !lg:p-2 lg:z-[100] text-sm lg:text-lg absolute top-2 right-[calc(25%-2.5rem)] lg:right-[calc(25%-64px)] xl:right-[calc(30%-64px)] z-[100]'
                              )}
                              type="button"
                              onClick={!isActive ? startDraft : stopDraft}
                           >
                              {!isActive ? 'Start Draft' : 'Stop Draft'}
                           </button>
                        </>
                     ) : (
                        <></>
                     ))}
                  {!isMobile ? (
                     <>
                        <div className="flex flex-col lg:max-w-[15vw] h-full w-full overflow-y-hidden">
                           <Suspense fallback={<TimerSkeleton />}>
                              <Timer {...timerProps} />
                           </Suspense>
                           <Suspense fallback={<DraftOrderSkeleton />}>
                              <DraftOrder {...draftOrderProps} />
                           </Suspense>
                        </div>
                        <div className="flex flex-col lg:max-w-[70vw] h-full w-full">
                           <FeaturedPlayer {...featuredPlayerProps} />
                           <Tabs {...tabProps} />
                        </div>
                        <div className="flex flex-col lg:max-w-[15vw] h-full w-full">
                           <Watchlist {...watchlistProps} />
                           <MyTeam {...myTeamProps} />
                           <Chat {...chatProps} />
                        </div>
                     </>
                  ) : (
                     <>
                        <Suspense fallback={<TimerSkeleton />}>
                           <Timer {...timerProps} />
                        </Suspense>
                        <Tabs {...mobileTabProps} />
                        {featuredPlayer && (
                           <FeaturedPlayer {...featuredPlayerProps} />
                        )}
                     </>
                  )}
               </>
            )}
         </DraftContext.Provider>
      </div>
   );
};
export default Board;
