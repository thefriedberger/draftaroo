'use client';

import { DraftBoardIcon } from '@/app/assets/images/icons/draft-board';
import { DraftOrderIcon } from '@/app/assets/images/icons/draft-order';
import { MyTeamIcon } from '@/app/assets/images/icons/my-team';
import { TeamsIcon } from '@/app/assets/images/icons/teams';
import { WatchlistIcon } from '@/app/assets/images/icons/watchlist';
import { setMainTimer, updateSupabaseWatchlist } from '@/app/utils/helpers';
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
import { Suspense, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Chat from '../chat';
import DraftOrder from '../draft-order';
import DraftOrderLoading from '../draft-order/loading';
import FeaturedPlayer from '../featured-player';
import AuthModal from '../modals/auth';
import MyTeam from '../my-team';
import PlayerList, { sortPlayers } from '../player-list';
import Tabs from '../tabs';
import TabsNavigation from '../tabs-navigation';
import TeamsList from '../teams-list';
import Timer from '../timer';
import NewTimer, { NewTimerProps } from '../timer/new-timer';
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
   draftedPlayers,
}: BoardProps) => {
   const supabase = createClientComponentClient<Database>();
   const owner = league.owner === user.id;
   const turnOrder = draftPicks;
   const numberOfRounds = leagueRules.number_of_rounds;
   const numberOfTeams = leagueRules.number_of_teams;

   const [watchlistState, setWatchlistState] = useState<number[]>(
      watchlist?.players ?? []
   );
   const [featuredPlayer, setFeaturedPlayer] = useState<Player | null>();
   const [isYourTurn, setIsYourTurn] = useState<boolean>(false);
   const [doStart, setDoStart] = useState<boolean>(false);
   const [doReset, setDoReset] = useState<boolean>(false);
   const [currentPick, setCurrentPick] = useState<number>(draft.current_pick);
   const [currentRound, setCurrentRound] = useState<number>(1);
   const [draftedPlayersState, setDraftedPlayersState] =
      useState<DraftSelection[]>(draftedPlayers);
   const [isActive, setIsActive] = useState<boolean>(draft?.is_active);
   const [isCompleted, setIsCompleted] = useState<boolean>(
      draft?.is_completed ?? false
   );
   const [draftedIDs, setDraftedIDs] = useState<number[]>([]);
   const [yourPlayers, setYourPlayers] = useState<number[]>([]);
   const [teamsViewPlayers, setTeamsViewPlayers] = useState<number[]>([]);
   const [teamViewToShow, setTeamViewToShow] = useState<string>('');

   const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

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
      setMainTimer(supabase, draft.id, Date.now() + 120 * 1000);
   };

   const handlePick = async () => {
      setCurrentPick(currentPick + 1);
      // setShouldFilterPlayers(true);

      await supabase
         .from('draft')
         .update({ current_pick: currentPick + 1 })
         .match({ id: draft.id });

      setMainTimer(supabase, draft.id, Date.now() + 120 * 1000);
      // setDoReset(true);
   };

   const handleDraftSelection = async (player: Player, teamId?: string) => {
      if (team && player && draft) {
         const { data, error } = await supabase
            .from('draft_selections')
            .insert({
               player_id: player.id,
               team_id: teamId ?? team.id,
               draft_id: draft.id,
               round: currentRound,
               pick: currentPick,
            });
         if (error) {
            console.log(error);
            return;
         }
         handlePick();
      }
   };

   const autoDraft = () => {
      const playerToDraft = sortPlayers(players, 'score', 1)[0] || null;
      if (playerToDraft)
         for (const team of turnOrder) {
            if (team.picks.includes(currentPick) && playerToDraft) {
               handleDraftSelection(playerToDraft, team.team_id);
            }
         }
   };

   const updateTeamsViewPlayers = (teamId: string) => {
      const teamPlayers = draftedPlayersState
         .filter((player: DraftSelection) => {
            return player.team_id === teamId;
         })
         .sort((a, b) => (a.pick < b.pick ? -1 : 1));
      return teamPlayers;
   };

   const updateWatchlist = async (player: Player, action: WatchlistAction) => {
      if (watchlistState) {
         if (action === WatchlistAction.DELETE) {
            setWatchlistState(watchlistState?.filter((el) => el !== player.id));
         }
         if (action === WatchlistAction.ADD) {
            setWatchlistState((prev) => [...prev, player.id]);
         }
         user &&
            updateSupabaseWatchlist(
               supabase,
               watchlistState,
               user?.id,
               draft.id
            );
      }
   };

   useEffect(() => {
      if (draftedPlayersState.length > 0) {
         for (const player of draftedPlayersState) {
            setDraftedIDs((prev) => [...prev, Number(player.player_id)]);
         }
         // setShouldFilterPlayers(true);
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
            console.log(tempTeams);
            setTeamsViewPlayers(tempTeams);
         }
      }
   }, [draftedPlayersState, teamViewToShow]);

   // checking for keepers is handled here
   useEffect(() => {
      if (isActive && owner) {
         if (draftedPlayersState.length > 0) {
            for (const player of draftedPlayersState) {
               if (player.pick === currentPick && player.is_keeper) {
                  setTimeout(() => {
                     handlePick();
                  }, 1000);
               }
            }
         }
      }
   }, [isActive, draftedPlayersState, currentPick]);

   // set if user can pick
   useEffect(() => {
      setIsYourTurn(
         turnOrder
            .filter((turn) => turn.team_id === team.id)[0]
            .picks.includes(currentPick)
      );
      if (
         isActive &&
         !turnOrder.filter((turn) => turn.team_id === team.id)[0].picks.length
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
      const draftChannel = supabase
         .channel('draft-channel')
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

      const pickChanel = supabase
         .channel('pick-channel')
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
   }, [supabase, draft, league]);

   // TODO: make draft start a time based feature
   useEffect(() => {
      isActive === undefined && draft && setIsActive(draft.is_active);
   }, [draft]);

   // TODO: remove when updating timer
   useEffect(() => {
      if (isActive) {
         setDoStart(true);
      } else {
         setDoStart(false);
      }
   }, [isActive]);

   useEffect(() => {
      const draftStatusChannel = supabase
         .channel('draft-is-active-channel')
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

   const filterDraftedPlayers = () => {
      players = players.filter((player: Player) => {
         return !draftedIDs.includes(player.id);
      });
      // setShouldFilterPlayers(false);
   };
   useEffect(() => {
      filterDraftedPlayers();
   }, [draftedIDs]);

   const timerProps: NewTimerProps = {
      owner: owner,
      currentPick: currentPick,
      doStart: doStart,
      doReset: doReset,
      setDoReset: setDoReset,
      currentRound: currentRound,
      isActive: isActive,
      autopick: autoDraft,
      yourTurn: isYourTurn,
      turnOrder: turnOrder,
      userTeam: team,
      isCompleted: isCompleted,
      draftId: draft.id,
   };

   const draftOrderProps: DraftOrderProps = {
      draftedPlayers: draftedPlayersState,
      currentPick: currentPick,
      teams: teams,
      isYourTurn: isYourTurn,
      turnOrder: turnOrder,
      league: league,
      players: players,
      teamID: team.id,
      numberOfRounds: numberOfRounds ?? 23,
      updateFeaturedPlayer: updateFeaturedPlayer,
   };

   const watchlistProps: WatchlistProps = {
      updateFeaturedPlayer: updateFeaturedPlayer,
      draftedIDs: draftedIDs,
      leagueID: league?.league_id ?? '',
      watchlist: watchlistState,
      updateWatchlist: updateWatchlist,
   };

   const featuredPlayerProps: FeaturedPlayerProps = {
      draftedIDs: draftedIDs,
      featuredPlayer: featuredPlayer || null,
      yourTurn: isYourTurn,
      watchlist: watchlistState,
      updateWatchlist: updateWatchlist,
      updateFeaturedPlayer: updateFeaturedPlayer,
      handleDraftSelection: handleDraftSelection,
   };

   const playerListProps: PlayerListProps = {
      league: league,
      draftedIDs: draftedIDs,
      watchlist: watchlistState,
      updateWatchlist: updateWatchlist,
      updateFeaturedPlayer: updateFeaturedPlayer,
      players: players,
   };

   const myTeamProps: MyTeamProps = {
      playerIDs: yourPlayers,
      players: players,
      updateFeaturedPlayer: updateFeaturedPlayer,
   };

   const teamsViewProps: TeamsListProps = {
      playerIDs: teamsViewPlayers,
      setTeamsViewPlayers: setTeamViewToShow,
      updateFeaturedPlayer: updateFeaturedPlayer,
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
         'flex flex-col w-full lg:max-w-screen-xl draft-tabs-container text-white',
      saveState: false,
   };

   const mobileTabProps: TabProps = {
      tabs: mobileTabs,
      centerTabs: false,
      className: `mobile-tabs ${
         featuredPlayer &&
         (!draftedIDs.includes(featuredPlayer?.id)
            ? 'featured-player-visible'
            : 'drafted-featured-player-visible')
      }`,
   };

   const chatProps: ChatProps = {
      user: user || null,
   };
   return (
      <div className={classNames('w-full flex flex-col lg:flex-row')}>
         {user && team?.league_id === league.league_id ? (
            <>
               {!isMobile ? (
                  <div className="draft-board w-full flex flex-col lg:flex-row">
                     {owner && !isActive && (
                        <button
                           className="bg-gray-primary p-1"
                           type="button"
                           onClick={startDraft}
                        >
                           Start Draft
                        </button>
                     )}
                     <div className="flex flex-col lg:max-w-[15vw] w-full">
                        <NewTimer {...timerProps} />
                        <Suspense fallback={<DraftOrderLoading />}>
                           <DraftOrder {...draftOrderProps} />
                        </Suspense>
                     </div>
                     <div className="flex flex-col lg:max-w-[70vw] w-full">
                        <FeaturedPlayer {...featuredPlayerProps} />
                        <Tabs {...tabProps} />
                     </div>
                     <div className="flex flex-col lg:max-w-[15vw] w-full">
                        <Watchlist {...watchlistProps} />
                        <MyTeam {...myTeamProps} />
                        <span className="hidden lg:block mt-auto h-[28%] self-start w-full">
                           <Chat {...chatProps} />
                        </span>
                     </div>{' '}
                  </div>
               ) : (
                  <>
                     <Timer {...timerProps} />
                     <TabsNavigation {...mobileTabProps} />
                     {featuredPlayer && (
                        <FeaturedPlayer {...featuredPlayerProps} />
                     )}
                  </>
               )}
            </>
         ) : (
            <>
               <AuthModal />
            </>
         )}
      </div>
   );
};
export default Board;
