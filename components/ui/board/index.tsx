'use client';

import { updateSupabaseWatchlist } from '@/app/utils/helpers';
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
   TimerProps,
   WatchlistProps,
} from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Chat from '../chat';
import DraftOrder from '../draft-order';
import FeaturedPlayer from '../featured-player';
import AuthModal from '../modals/auth';
import MyTeam from '../my-team';
import PlayerList, { sortPlayers } from '../player-list';
import Tabs from '../tabs';
import TabsNavigation from '../tabs-navigation';
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
         .match({ league_id: league.league_id, id: draft.id });
   };

   const handlePick = async () => {
      setCurrentPick(currentPick + 1);
      // setShouldFilterPlayers(true);

      await supabase
         .from('draft')
         .update({ current_pick: currentPick + 1 })
         .match({ league_id: league.league_id, id: draft.id });

      setDoReset(true);
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
            if (team.picks.includes(currentPick))
               playerToDraft &&
                  handleDraftSelection(playerToDraft, team.team_id);
         }
   };

   const updateTeamsViewPlayers = (teamId: string) => {
      const teamPlayers = draftedPlayersState.filter(
         (player: DraftSelection) => {
            return player.team_id === teamId;
         }
      );
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
            player.player_id &&
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
                  )
                     tempTeams.push(player.player_id);
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
                  }, 1000);
               }
            }
         }
      }
   }, [isActive, draftedPlayersState, currentPick]);

   // set if user can pick
   useEffect(() => {
      if (
         isActive &&
         !turnOrder.filter((turn) => turn.team_id === team.id)[0].picks.length
      ) {
         const draftedPlayer = draftedPlayersState.filter(
            (player: DraftSelection) => {
               return player.pick === currentPick;
            }
         );
         if (draftedPlayer.length === 0)
            setIsYourTurn(
               turnOrder
                  .filter((turn) => turn.team_id === team.id)[0]
                  .picks.includes(currentPick)
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
               filter: `league_id=eq.${league.league_id}&id=eq.${draft.id}`,
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

   const timerProps: TimerProps = {
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
               <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     d="M5 9.77746V16.2C5 17.8802 5 18.7203 5.32698 19.362C5.6146 19.9265 6.07354 20.3854 6.63803 20.673C7.27976 21 8.11984 21 9.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7203 19 17.8802 19 16.2V5.00002M21 12L15.5668 5.96399C14.3311 4.59122 13.7133 3.90484 12.9856 3.65144C12.3466 3.42888 11.651 3.42893 11.0119 3.65159C10.2843 3.90509 9.66661 4.59157 8.43114 5.96452L3 12"
                     stroke="#ffffff"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
               <p className="text-[8px]">Draft Board</p>
            </>
         ),
         tabPane: <PlayerList {...playerListProps} />,
      },
      {
         tabButton: (
            <>
               <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     d="M3 9.5H21M3 14.5H21M8 4.5V19.5M6.2 19.5H17.8C18.9201 19.5 19.4802 19.5 19.908 19.282C20.2843 19.0903 20.5903 18.7843 20.782 18.408C21 17.9802 21 17.4201 21 16.3V7.7C21 6.5799 21 6.01984 20.782 5.59202C20.5903 5.21569 20.2843 4.90973 19.908 4.71799C19.4802 4.5 18.9201 4.5 17.8 4.5H6.2C5.0799 4.5 4.51984 4.5 4.09202 4.71799C3.71569 4.90973 3.40973 5.21569 3.21799 5.59202C3 6.01984 3 6.57989 3 7.7V16.3C3 17.4201 3 17.9802 3.21799 18.408C3.40973 18.7843 3.71569 19.0903 4.09202 19.282C4.51984 19.5 5.07989 19.5 6.2 19.5Z"
                     stroke="#ffffff"
                     strokeWidth="2"
                  />
               </svg>
               <p className="text-[8px]">Draft Order</p>
            </>
         ),
         tabPane: <DraftOrder {...draftOrderProps} />,
      },
      {
         tabButton: (
            <>
               <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[30px] stroke-white"
               >
                  <path
                     d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
               <p className="text-[8px]">Watchlist</p>
            </>
         ),
         tabPane: <Watchlist {...watchlistProps} />,
      },
      {
         tabButton: (
            <>
               <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                     stroke="#ffffff"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
                  <path
                     d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                     stroke="#ffffff"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
               <p className="text-[8px]">Your Team</p>
            </>
         ),
         tabPane: <MyTeam {...myTeamProps} />,
      },
      {
         tabButton: (
            <>
               <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     d="M6.00098 4H6.01098M3.17188 10C3.58371 8.83481 4.69495 8 6.00117 8C7.30739 8 8.41863 8.83481 8.83046 10M6.00098 15H6.01098M3.17188 21C3.58371 19.8348 4.69495 19 6.00117 19C7.30739 19 8.41863 19.8348 8.83046 21M13.601 8.5H19.401C19.961 8.5 20.2411 8.5 20.455 8.39101C20.6431 8.29513 20.7961 8.14215 20.892 7.95399C21.001 7.74008 21.001 7.46005 21.001 6.9V6.1C21.001 5.53995 21.001 5.25992 20.892 5.04601C20.7961 4.85785 20.6431 4.70487 20.455 4.60899C20.2411 4.5 19.961 4.5 19.401 4.5H13.601C13.0409 4.5 12.7609 4.5 12.547 4.60899C12.3588 4.70487 12.2058 4.85785 12.11 5.04601C12.001 5.25992 12.001 5.53995 12.001 6.1V6.9C12.001 7.46005 12.001 7.74008 12.11 7.95399C12.2058 8.14215 12.3588 8.29513 12.547 8.39101C12.7609 8.5 13.0409 8.5 13.601 8.5ZM13.601 19.5H19.401C19.961 19.5 20.2411 19.5 20.455 19.391C20.6431 19.2951 20.7961 19.1422 20.892 18.954C21.001 18.7401 21.001 18.4601 21.001 17.9V17.1C21.001 16.5399 21.001 16.2599 20.892 16.046C20.7961 15.8578 20.6431 15.7049 20.455 15.609C20.2411 15.5 19.961 15.5 19.401 15.5H13.601C13.0409 15.5 12.7609 15.5 12.547 15.609C12.3588 15.7049 12.2058 15.8578 12.11 16.046C12.001 16.2599 12.001 16.5399 12.001 17.1V17.9C12.001 18.4601 12.001 18.7401 12.11 18.954C12.2058 19.1422 12.3588 19.2951 12.547 19.391C12.7609 19.5 13.0409 19.5 13.601 19.5ZM7.00098 4C7.00098 4.55228 6.55326 5 6.00098 5C5.44869 5 5.00098 4.55228 5.00098 4C5.00098 3.44772 5.44869 3 6.00098 3C6.55326 3 7.00098 3.44772 7.00098 4ZM7.00098 15C7.00098 15.5523 6.55326 16 6.00098 16C5.44869 16 5.00098 15.5523 5.00098 15C5.00098 14.4477 5.44869 14 6.00098 14C6.55326 14 7.00098 14.4477 7.00098 15Z"
                     stroke="#ffffff"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
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
                        <Timer {...timerProps} />
                        <DraftOrder {...draftOrderProps} />
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
``;
