'use client';

import { DraftBoardIcon } from '@/app/assets/images/icons/draft-board';
import { DraftOrderIcon } from '@/app/assets/images/icons/draft-order';
import { MyTeamIcon } from '@/app/assets/images/icons/my-team';
import { TeamsIcon } from '@/app/assets/images/icons/teams';
import { WatchlistIcon } from '@/app/assets/images/icons/watchlist';
import getTime from '@/app/utils/get-time';
import {
   fetchAutoDraftStatusByDraft,
   fetchOwnerByTeam,
   fetchWatchlist,
   handleDraftSelection,
   HandleDraftSelectionsProps,
   handlePick,
   setDraftCompleted,
   setMainTimer,
   updateSupabaseWatchlist,
} from '@/app/utils/helpers';
import { DraftContext } from '@/components/context/draft-context';
import { WatchlistAction } from '@/components/context/page-context';
import {
   BoardProps,
   DraftedPlayer,
   DraftOrderProps,
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
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { buttonClasses } from '../../helpers/buttons';
import Tabs from '../../tabs';
import DraftOrder, { Pick } from '../components/draft-order';
import DraftOrderMobile from '../components/draft-order/mobile';
import FeaturedPlayer from '../components/featured-player';
import MyTeam from '../components/my-team';
import PlayerList, {
   cleanSeasons,
   seasons,
   sortPlayers,
} from '../components/player-list';
import TeamsList from '../components/teams-list';
import Timer, { DraftPicksFields } from '../components/timer';
import Watchlist from '../components/watchlist';
import BoardSkeleton from '../skeletons';

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
   const numberOfRounds = leagueRules.number_of_rounds;
   const numberOfTeams = leagueRules.number_of_teams;
   const [isYourTurn, setIsYourTurn] = useState<boolean>(false);
   const [pickIsKeeper, setPickIsKeeper] = useState<boolean>(false);
   const [picks, setPicks] = useState<Pick[]>([]);
   const router = useRouter();
   const params = useParams();

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
   const [autoDraftTeams, setAutoDraftTeams] = useState<DraftPicksFields[]>([]);
   const [draftedIds, setdraftedIds] = useState<number[]>([]);
   const [yourPlayers, setYourPlayers] = useState<DraftedPlayer[]>([]);
   const [teamsViewPlayers, setTeamsViewPlayers] = useState<DraftedPlayer[]>(
      []
   );
   const [teamViewToShow, setTeamViewToShow] = useState<string>('');
   const [timer, setTimer] = useState<number>(timerDuration);
   const [hash, setHash] = useState<string>(window.location.hash);

   /*** end states ***/

   const timerHeight: HeightType = { value: 90, type: 'px' };
   const draftOrderHeight: HeightType = { value: 25, type: 'vh' };
   const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });

   const draftPicksChannel = supabase.channel(
      `public:draft_picks:draft_id=eq.${draft.id}`
   );
   const subscribeToDraftPicksRoom = (
      draftId: string,
      changeCallback: (payload: any) => void
   ) => {
      draftPicksChannel
         .on(
            'postgres_changes',
            {
               event: '*',
               schema: 'public',
               table: 'draft_picks',
               filter: `draft_id=eq.${draftId}`,
            },
            (payload) => {
               changeCallback(payload.new);
            }
         )
         .subscribe();

      return draftPicks;
   };

   const onDraftPicksChange = (payload: DraftPicksFields) => {
      const foundTeam =
         autoDraftTeams.filter((team) => team.team_id === payload.team_id) &&
         payload;

      if (!foundTeam && payload.auto_draft) {
         setAutoDraftTeams((prev) => [...prev, payload]);
      }
      if (foundTeam) {
         if (payload.auto_draft) {
            setAutoDraftTeams([
               ...autoDraftTeams.filter(
                  (team) => team.team_id !== payload.team_id
               ),
               foundTeam,
            ]);
         } else {
            setAutoDraftTeams(
               autoDraftTeams.filter((team) => team.team_id !== payload.team_id)
            );
         }
      }
   };

   useEffect(() => {
      (async () => {
         const t = await fetchAutoDraftStatusByDraft(supabase, draft.id);
         setAutoDraftTeams(t || []);
      })();
   }, []);

   useEffect(() => {
      subscribeToDraftPicksRoom(draft.id, onDraftPicksChange);
   }, [autoDraftTeams]);

   interface HeightType {
      value: number;
      type: 'px' | 'vh' | 'vw' | '%';
   }
   const handleDraftSelectionProps: Omit<
      HandleDraftSelectionsProps,
      'player' | 'timerDuration'
   > = {
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

   useEffect(() => {
      const handleHashChange = () => {
         setHash(window.location.hash);
      };
      window.addEventListener('hashchange', handleHashChange);
   }, []);

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
      if (numberOfTeams) {
         if (currentPick >= numberOfTeams) {
            setCurrentRound(Math.ceil(currentPick / numberOfTeams));
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
                  numberOfRounds &&
                  numberOfTeams &&
                  numberOfRounds * numberOfTeams;
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
               cleanSeasons(seasons[2])
            )[0]) ||
         null;

      const bpa =
         sortPlayers(
            players.filter((player) => {
               return !draftedIds.includes(player.id);
            }),
            'score',
            cleanSeasons(seasons[2])
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
                 cleanSeasons(seasons[2])
              )[0] || null;

      if (!playerToDraft) return;
      handleDraftSelection({
         ...handleDraftSelectionProps,
         player: playerToDraft,
         teamId: autoDraftTeam.team_id,
         timerDuration,
      });
   };

   const updateTimer = (value: number) => {
      setTimer(value);
      return value;
   };

   const getHeight = (height: HeightType) => {
      return `${height.value}${height.type}`;
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

   const getDraftOrderHeight = () => {};
   useEffect(() => {
      updateSupabaseWatchlist(supabase, watchlistState, user?.id, draft.id);
   }, [watchlistState]);

   const filterDraftedPlayers = () => {
      players = players.filter((player: Player) => {
         return !draftedIds.includes(player.id);
      });
   };

   const updateDraftedPlayers = () => {
      const tempPicks: Pick[] = picks.map((pick) => {
         let foundPlayer;
         for (const draftedPlayer of draftedPlayersState) {
            if (pick.draftPosition === draftedPlayer.pick) {
               const player = players.find(
                  (p) => p.id === draftedPlayer.player_id
               );
               foundPlayer = {
                  draftPosition: draftedPlayer.pick,
                  playerID: draftedPlayer.player_id,
                  username: pick.username,
                  yourPick: pick.yourPick,
                  isKeeper: draftedPlayer.is_keeper,
                  playerName: `${player?.first_name.charAt(0)}. ${
                     player?.last_name
                  }`,
               };
               break;
            }
         }
         if (foundPlayer?.playerID) {
            return {
               ...foundPlayer,
            };
         }
         return pick;
      });
      return tempPicks;
   };
   useEffect(() => {
      const populatePicks = () => {
         const tempPicksArray: Pick[] = Array.from({
            length: numberOfRounds * numberOfTeams,
         }).map((v, i) => {
            const pick: Pick = {
               draftPosition: i + 1,
               username: '',
               yourPick: false,
               isKeeper: false,
            };
            for (const draftedPlayer of draftedPlayersState) {
               if (pick.draftPosition === draftedPlayer.pick) {
                  const player = players.find(
                     (p) => p.id === draftedPlayer.player_id
                  );
                  pick.playerID = draftedPlayer.player_id;
                  pick.isKeeper = draftedPlayer.is_keeper;
                  pick.playerName = `${player?.first_name.charAt(0)}. ${
                     player?.last_name
                  }`;
                  break;
               }
            }
            for (const turn of turnOrder.current) {
               if (turn.picks.includes(i + 1)) {
                  pick.username = teams.filter((team: Team) => {
                     return team.id === turn.team_id;
                  })?.[0]?.team_name;
                  if (turn.team_id === team.id) {
                     pick.yourPick = true;
                  }
               }
            }
            return pick;
         });
         setPicks(tempPicksArray);
      };
      if (teams.length > 0 && turnOrder.current.length) {
         populatePicks();
      }
      // @es-lint-ignore react-hooks/exhaustive-deps
   }, [teams, numberOfRounds, turnOrder]);

   useEffect(() => {
      picks.length > 0 && setPicks(updateDraftedPlayers());
   }, [draftedPlayersState]);
   const timerProps: TimerProps = {
      owner: isOwner.current,
      currentPick: currentPick,
      currentRound: currentRound,
      isActive: isActive,
      autopick: autoDraft,
      yourTurn: isYourTurn,
      turnOrder: turnOrder.current as DraftPicksFields[],
      userTeam: team,
      isCompleted: isCompleted,
      draftId: draft.id,
      timerDuration,
      userPicks: picks,
      pickIsKeeper: pickIsKeeper,
      autoDraftTeams: autoDraftTeams,
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
      numberOfRounds: numberOfRounds ?? 23,
      picks,
      timer,
      timerDuration,
      hash,
      autoDraftTeams: autoDraftTeams,
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
      featuredPlayer: featuredPlayer || null,
      isYourTurn: isYourTurn,
      handleDraftSelectionProps: handleDraftSelectionProps,
      timerDuration: timerDuration,
      isActive: isActive,
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
               <MyTeamIcon />
               <p className="text-[8px]">Your Team</p>
            </>
         ),
         tabPane: <MyTeam {...myTeamProps} />,
      },
      {
         tabButton: (
            <>
               <TeamsIcon />
               <p className="text-[8px]">Other Teams</p>
            </>
         ),
         tabPane: <TeamsList {...teamsViewProps} />,
      },
   ];
   const tabProps: TabProps = {
      tabs,
      centerTabs: false,
      className: 'flex flex-col w-full lg:max-w-[75%] text-white',
      saveState: true,
      useHash: false,
   };

   const mobileTabProps: TabProps = {
      tabs: mobileTabs,
      centerTabs: false,
      className: classNames(
         hash !== '#draft-order' && 'h-full',
         hash === '#draft-order' ? 'pt-0 h-0' : 'pt-2 h-full',
         `shadow-[0px_-5px_10px_black] z-[100] flex flex-col-reverse w-full overflow-y-scroll`
      ),
      saveState: true,
      gridColumns: `grid-cols-5`,
      useHash: true,
   };
   return (
      <div className="flex flex-col items-center w-full max-h-[calc(100vh-66px)] lg:max-h-[100vh] overflow-y-scroll lg:overflow-y-hidden draft-board">
         <DraftContext.Provider
            value={{
               watchlist: watchlistState,
               updateWatchlist,
               reorderWatchlist,
               updateFeaturedPlayer,
               timer: timerDuration,
               updateTimer: updateTimer,
            }}
         >
            {user && team?.league_id === league.league_id && picks.length ? (
               <>
                  {isOwner.current &&
                     (!isCompleted && !isMobile ? (
                        <>
                           <button
                              onClick={autoDraft}
                              type="button"
                              className={classNames(
                                 buttonClasses,
                                 'w-20 h-10 !p-1 !lg:p-2 lg:z-[100] text-sm lg:text-lg absolute top-2 right-auto left-16 lg:left-auto lg:right-80 z-[100]'
                              )}
                           >
                              Auto
                           </button>
                           <button
                              className={classNames(
                                 buttonClasses,
                                 'w-20 h-10 !p-1 !lg:p-2 lg:z-[100] text-sm lg:text-lg absolute top-2 right-[calc(25%-2.5rem)] lg:right-60 z-[100]'
                              )}
                              type="button"
                              onClick={!isActive ? startDraft : stopDraft}
                           >
                              {!isActive ? 'Start' : 'Stop'}
                           </button>
                           <button
                              className={classNames(
                                 buttonClasses,
                                 'w-20 h-10 !p-1 !lg:p-2 lg:z-[100] text-sm lg:text-lg absolute top-2 left-[calc(25%-2.5rem)] lg:left-60 z-[100]'
                              )}
                              type="button"
                              onClick={async () =>
                                 await fetch('/reset-draft-selections', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                       draft_id: draft.id,
                                    }),
                                 }).then(() => router.refresh())
                              }
                           >
                              Reset
                           </button>
                        </>
                     ) : (
                        <></>
                     ))}
                  {!isMobile ? (
                     <>
                        <div
                           style={{
                              minHeight: `calc(${getHeight(
                                 timerHeight
                              )} + ${getHeight(draftOrderHeight)})`,
                           }}
                           className="flex flex-col w-full h-fit overflow-hidden"
                        >
                           <div
                              style={{ height: getHeight(timerHeight) }}
                              className=""
                           >
                              <Timer {...timerProps} />
                           </div>
                           <div
                              style={{ height: getHeight(draftOrderHeight) }}
                              className="overflow-hidden px-1 relative lg:pt-8"
                           >
                              <DraftOrder {...draftOrderProps} />
                           </div>
                        </div>
                        <div
                           style={{
                              height: `calc(100vh - ${getHeight(
                                 draftOrderHeight
                              )} - ${getHeight(timerHeight)})`,
                           }}
                           className="flex h-full w-full"
                        >
                           <Tabs {...tabProps} />
                           <div className="flex flex-col h-full min-w-[25%]">
                              <Watchlist {...watchlistProps} />
                              <MyTeam {...myTeamProps} />
                           </div>
                        </div>
                        <FeaturedPlayer {...featuredPlayerProps} />
                     </>
                  ) : (
                     <>
                        <Timer {...timerProps} />
                        <div
                           className={classNames(
                              hash === '#draft-order'
                                 ? 'max-h-full min-h-full'
                                 : 'min-h-56 max-h-56',
                              'max-w-full overflow-x-hidden'
                           )}
                        >
                           <DraftOrderMobile {...draftOrderProps} />
                        </div>
                        <Tabs {...mobileTabProps} />
                        {featuredPlayer && (
                           <FeaturedPlayer {...featuredPlayerProps} />
                        )}
                     </>
                  )}
               </>
            ) : (
               <BoardSkeleton />
            )}
         </DraftContext.Provider>
      </div>
   );
};
export default Board;
