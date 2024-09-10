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
import { Suspense, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Chat from '../chat';
import DraftOrder from '../draft-order';
import DraftOrderLoading from '../draft-order/loading';
import FeaturedPlayer from '../featured-player';
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
   const owner = league.owner === user.id;
   const turnOrder = draftPicks;
   const numberOfRounds = leagueRules.number_of_rounds;
   const numberOfTeams = leagueRules.number_of_teams;

   /*** Channels ***/
   const isYourTurn = useRef<boolean>(false);

   /*** Context ***/
   const [watchlistState, setWatchlistState] = useState<number[]>(
      watchlist?.players ?? []
   ); // TODO: use context and reducer

   /*** States ***/
   const [featuredPlayer, setFeaturedPlayer] = useState<Player | null>();
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

   /*** Channels ***/
   const draftChannel = supabase.channel('draft-channel');
   const pickChannel = supabase.channel('pick-channel');
   const draftStatusChannel = supabase.channel('draft-is-active-channel');

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
      if (isActive && owner) {
         if (draftedPlayersState.length > 0) {
            for (const player of draftedPlayersState) {
               if (player.pick === currentPick && player.is_keeper) {
                  setTimeout(() => {
                     handlePick();
                  }, 500);
               }
            }
         }
      }
   }, [isActive, draftedPlayersState, currentPick]);

   // set if user can pick
   useEffect(() => {
      isYourTurn.current = turnOrder
         .filter((turn) => turn.team_id === team.id)?.[0]
         ?.picks?.includes(currentPick);

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

   const handlePick = async () => {
      setCurrentPick(currentPick + 1);
      setMainTimer(supabase, draft.id, Date.now() + TIMER_DURATION * 1000);

      await supabase
         .from('draft')
         .update({ current_pick: currentPick + 1 })
         .match({ id: draft.id });
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
      const playerToDraft =
         sortPlayers(
            players.filter((player) => !draftedIDs.includes(player.id)),
            'score',
            1
         )[0] || null;
      if (playerToDraft) {
         for (const team of turnOrder) {
            if (team.picks.includes(currentPick) && playerToDraft) {
               setTimeout(() => {
                  handleDraftSelection(playerToDraft, team.team_id);
               }, 500);
            }
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

   const filterDraftedPlayers = () => {
      players = players.filter((player: Player) => {
         return !draftedIDs.includes(player.id);
      });
   };

   const timerProps: NewTimerProps = {
      owner: owner,
      currentPick: currentPick,
      currentRound: currentRound,
      isActive: isActive,
      autopick: autoDraft,
      yourTurn: isYourTurn.current,
      turnOrder: turnOrder,
      userTeam: team,
      isCompleted: isCompleted,
      draftId: draft.id,
   };

   const draftOrderProps: DraftOrderProps = {
      draftedPlayers: draftedPlayersState,
      currentPick: currentPick,
      teams: teams,
      isYourTurn: isYourTurn.current,
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
      players: players,
      updateWatchlist: updateWatchlist,
   };

   const featuredPlayerProps: FeaturedPlayerProps = {
      draftedIDs: draftedIDs,
      featuredPlayer: featuredPlayer || null,
      yourTurn: isYourTurn.current,
      watchlist: watchlistState,
      updateWatchlist: updateWatchlist,
      updateFeaturedPlayer: updateFeaturedPlayer,
      handleDraftSelection: handleDraftSelection,
      isActive: isActive,
      leagueScoring: leagueScoring,
   };

   const playerListProps: PlayerListProps = {
      league: league,
      draftedIDs: draftedIDs,
      watchlist: watchlistState,
      updateWatchlist: updateWatchlist,
      updateFeaturedPlayer: updateFeaturedPlayer,
      players: players,
      leagueScoring: leagueScoring,
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
         'flex flex-col w-full lg:max-w-screen-xl md:h-[65%] text-white',
      saveState: false,
   };

   const mobileTabProps: TabProps = {
      tabs: mobileTabs,
      centerTabs: false,
      className: `flex flex-col-reverse w-full h-[calc(100%-66px)] overflow-y-scroll mobile-tabs ${
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
      <div className="flex flex-col md:flex-row items-center w-full overflow-y-scroll md:overflow-y-hidden draft-board">
         {user && team?.league_id === league.league_id && (
            <>
               {!isMobile ? (
                  <>
                     {owner && !isActive && (
                        <button
                           className="bg-gray-primary p-1"
                           type="button"
                           onClick={startDraft}
                        >
                           Start Draft
                        </button>
                     )}
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
      </div>
   );
};
export default Board;
