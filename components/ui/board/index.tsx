'use client';

import { DraftBoardIcon } from '@/app/assets/images/icons/draft-board';
import { DraftOrderIcon } from '@/app/assets/images/icons/draft-order';
import { MyTeamIcon } from '@/app/assets/images/icons/my-team';
import { TeamsIcon } from '@/app/assets/images/icons/teams';
import { WatchlistIcon } from '@/app/assets/images/icons/watchlist';
import {
   handleDraftSelection,
   handlePick,
   setMainTimer,
   updateSupabaseWatchlist,
} from '@/app/utils/helpers';
import { DraftContext } from '@/components/context/draft-context';
import { WatchlistAction } from '@/components/context/page-context';
import {
   BoardProps,
   ChatProps,
   DraftOrderProps,
   FeaturedPlayerProps,
   MyTeamProps,
   PlayerListProps,
   Tab,
   TabProps,
   TeamsListProps,
   WatchlistProps,
} from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Chat from '../chat';
import DraftOrder from '../draft-order';
import DraftOrderLoading from '../draft-order/loading';
import FeaturedPlayer from '../featured-player';
import { buttonClasses } from '../helpers/buttons';
import MyTeam from '../my-team';
import PlayerList, { sortPlayers } from '../player-list';
import Tabs from '../tabs';
import TeamsList from '../teams-list';
import NewTimer, { NewTimerProps, TIMER_DURATION } from '../timer/new-timer';
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
}: BoardProps) => {
   const supabase = createClientComponentClient<Database>();
   const isOwner = useRef(league.owner === user.id);
   const turnOrder = useRef(draftPicks);
   const numberOfRounds = useRef(leagueRules.number_of_rounds);
   const numberOfTeams = useRef(leagueRules.number_of_teams);
   const isYourTurn = useRef<boolean>(false);

   /*** Channels ***/
   const draftChannel = supabase.channel('draft-channel');
   const pickChannel = supabase.channel('pick-channel');
   const draftStatusChannel = supabase.channel('draft-is-active-channel');

   /*** States ***/
   const [featuredPlayer, setFeaturedPlayer] = useState<Player | null>();
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
   const [draftedIDs, setDraftedIDs] = useState<number[]>([]);
   const [yourPlayers, setYourPlayers] = useState<number[]>([]);
   const [teamsViewPlayers, setTeamsViewPlayers] = useState<number[]>([]);
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
            setDraftedIDs((prev) => [...prev, Number(player.player_id)]);
         }
      }
   }, [draftedPlayersState]);

   // set my team and other teams players
   useEffect(() => {
      updateTeamsViewPlayers(team.id).forEach(
         (player: DraftSelection) =>
            player &&
            !yourPlayers.includes(player.player_id) &&
            setYourPlayers((prev) => [...prev, player.player_id])
      );
      if (teamViewToShow !== '') {
         if (updateTeamsViewPlayers(teamViewToShow).length === 0) {
            setTeamsViewPlayers([]);
         } else {
            let tempTeams: number[] = [];
            updateTeamsViewPlayers(teamViewToShow).forEach(
               (player: DraftSelection) => {
                  if (
                     player.player_id &&
                     !teamsViewPlayers.includes(player.player_id)
                  ) {
                     tempTeams.push(player.player_id);
                  }
               }
            );
            setTeamsViewPlayers(tempTeams);
         }
      }
   }, [draftedPlayersState, teamViewToShow]);

   // checking for keepers is handled here
   useEffect(() => {
      if (isActive && isOwner.current) {
         if (draftedPlayersState.length > 0) {
            for (const player of draftedPlayersState) {
               if (player.pick === currentPick && player.is_keeper) {
                  setTimeout(() => {
                     handlePick(supabase, draft, currentPick);
                  }, 500);
               }
            }
         }
      }
   }, [isActive, draftedPlayersState, currentPick]);

   // set if user can pick
   useEffect(() => {
      isYourTurn.current = turnOrder.current
         .filter((turn) => turn.team_id === team.id)?.[0]
         ?.picks?.includes(currentPick);

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
               setCurrentPick(payload.new.current_pick);
            }
         )
         .subscribe();
   }, [supabase, draft]);

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
   }, [draftedIDs]);

   const updateFeaturedPlayer = (player: Player | null, playerID?: number) => {
      if (playerID) {
         player = players.filter((toSearch) => {
            return toSearch.id === playerID;
         })?.[0];
      }
      if (!player) setFeaturedPlayer(null);
      setFeaturedPlayer(player);
   };

   const startDraft = async () => {
      await supabase
         .from('draft')
         .update({ is_active: true })
         .match({ id: draft.id });
      setMainTimer(supabase, draft.id, Date.now() + TIMER_DURATION * 1000);
   };

   const stopDraft = async () => {
      await supabase
         .from('draft')
         .update({ is_active: false })
         .match({ id: draft.id });
   };
   const autoDraft = () => {
      const autoDraftTeam = turnOrder.current.find((team) =>
         team.picks.includes(currentPick)
      );

      if (!autoDraftTeam) return;

      const playerToDraft =
         sortPlayers(
            players.filter((player) => !draftedIDs.includes(player.id)),
            'score',
            1
         )[0] || null;
      if (!playerToDraft) return;
      handleDraftSelection({
         ...handleDraftSelectionProps,
         player: playerToDraft,
         teamId: autoDraftTeam.team_id,
      });
   };

   const updateTeamsViewPlayers = (teamId: string) => {
      const teamPlayers = draftedPlayersState
         .filter((player: DraftSelection) => {
            return player.team_id === teamId;
         })
         .sort((a, b) => (a.pick < b.pick ? -1 : 1));
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

   useEffect(() => {
      updateSupabaseWatchlist(supabase, watchlistState, user?.id, draft.id);
   }, [watchlistState]);

   const filterDraftedPlayers = () => {
      players = players.filter((player: Player) => {
         return !draftedIDs.includes(player.id);
      });
   };

   const timerProps: NewTimerProps = {
      owner: isOwner.current,
      currentPick: currentPick,
      currentRound: currentRound,
      isActive: isActive,
      autopick: autoDraft,
      yourTurn: isYourTurn.current,
      turnOrder: turnOrder.current,
      userTeam: team,
      isCompleted: isCompleted,
      draftId: draft.id,
   };

   const draftOrderProps: DraftOrderProps = {
      draftedPlayers: draftedPlayersState,
      currentPick: currentPick,
      teams: teams,
      isYourTurn: isYourTurn.current,
      turnOrder: turnOrder.current,
      league: league,
      players: players,
      teamID: team.id,
      numberOfRounds: numberOfRounds.current ?? 23,
   };

   const watchlistProps: WatchlistProps = {
      draftedIDs: draftedIDs,
      leagueID: league?.league_id ?? '',
      players: players,
   };

   const featuredPlayerProps: FeaturedPlayerProps = {
      draftedIDs: draftedIDs,
      featuredPlayer: featuredPlayer || null,
      yourTurn: isYourTurn.current,
      handleDraftSelectionProps: handleDraftSelectionProps,
      isActive: isActive,
      leagueScoring: leagueScoring,
   };

   const playerListProps: PlayerListProps = {
      league: league,
      draftedIDs: draftedIDs,
      players: players,
      leagueScoring: leagueScoring,
   };

   const myTeamProps: MyTeamProps = {
      playerIDs: yourPlayers,
      players: players,
   };

   const teamsViewProps: TeamsListProps = {
      playerIDs: teamsViewPlayers,
      setTeamsViewPlayers: setTeamViewToShow,
      teams: teams,
      players: players,
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
      saveState: false,
   };

   const mobileTabProps: TabProps = {
      tabs: mobileTabs,
      centerTabs: false,
      className: `flex flex-col-reverse w-full h-[calc(100%-66px)] overflow-y-scroll ${
         featuredPlayer &&
         (!draftedIDs.includes(featuredPlayer?.id)
            ? 'featured-player-visible'
            : 'drafted-featured-player-visible')
      }`,
      saveState: false,
   };

   const chatProps: ChatProps = {
      user: user,
   };
   return (
      <div className="flex flex-col lg:flex-row items-center w-full overflow-y-scroll lg:overflow-y-hidden draft-board">
         {' '}
         <DraftContext.Provider
            value={{
               watchlist: watchlistState,
               updateWatchlist,
               updateFeaturedPlayer,
            }}
         >
            {user && team?.league_id === league.league_id && (
               <>
                  {isOwner.current && !isActive ? (
                     <button
                        className={classNames(
                           buttonClasses,
                           'w-full lg:w-auto lg:h-full'
                        )}
                        type="button"
                        onClick={startDraft}
                     >
                        Start Draft
                     </button>
                  ) : (
                     <button
                        className={classNames(
                           buttonClasses,
                           'w-full lg:w-auto lg:h-full'
                        )}
                        type="button"
                        onClick={stopDraft}
                     >
                        Stop Draft
                     </button>
                  )}
                  {!isMobile ? (
                     <>
                        <div className="flex flex-col lg:max-w-[15vw] h-full w-full overflow-y-hidden">
                           <NewTimer {...timerProps} />
                           <Suspense fallback={<DraftOrderLoading />}>
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
                        <NewTimer {...timerProps} />
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
