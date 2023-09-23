'use client';

import {
   BoardProps,
   DraftOrderProps,
   FeaturedPlayerProps,
   PlayerListProps,
   TabProps,
   TimerProps,
   WatchlistProps,
} from '@/lib/types';
import getPlayers from '@/utils/get-players';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { PageContext } from '../context/page-context';
import DraftOrder from '../draft-order';
import FeaturedPlayer from '../featured-player';
import MyTeam from '../my-team';
import PlayerList, { sortPlayers } from '../player-list';
import Timer from '../timer';
import Watchlist from '../watchlist';

const Board = (props: BoardProps) => {
   const supabase = createClientComponentClient<Database>();
   const { leagueID, draft } = props;

   const [featuredPlayer, setFeaturedPlayer] = useState<Player>();
   const [isYourTurn, setIsYourTurn] = useState<boolean>(false);
   const [doStart, setDoStart] = useState<boolean>(false);
   const [doReset, setDoReset] = useState<boolean>(false);
   const [currentPick, setCurrentPick] = useState<number>(1);
   const [currentRound, setCurrentRound] = useState<number>(1);
   const [owner, setOwner] = useState<boolean>(false);
   const [draftedPlayers, setDraftedPlayers] = useState<DraftSelection[]>([]);
   const [originalPlayers, setOriginalPlayers] = useState<Player[]>([]);
   const [league, setLeague] = useState<League | any>();
   const [turnOrder, setTurnOrder] = useState<any>([]);
   const [team, setTeam] = useState<Team | any>(null);
   const [numberOfTeams, setNumberOfTeams] = useState<number>();
   const [teams, setTeams] = useState<Team[] | any>([]);
   const [shouldFetchDraftedPlayers, setShouldFetchDraftedPlayers] =
      useState<boolean>(true);
   const [isActive, setIsActive] = useState<boolean>(draft?.is_active);
   const [draftedIDs, setDraftedIDs] = useState<number[]>([]);
   const [players, setPlayers] = useState<Player[]>([]);
   const [shouldFilterPlayers, setShouldFilterPlayers] =
      useState<boolean>(false);
   const { user, userTeams, leagues } = useContext(PageContext);

   const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

   const updateFeaturedPlayer = (player: Player) => {
      setFeaturedPlayer(player);
   };

   const startDraft = async () => {
      await supabase
         .from('draft')
         .update({ is_active: true })
         .match({ league_id: leagueID });
   };

   const filterDraftedPlayers = () => {
      setPlayers(
         players.filter((player: Player) => {
            return !draftedIDs.includes(player.id);
         })
      );
      setShouldFilterPlayers(false);
   };

   const handlePick = async () => {
      setCurrentPick(currentPick + 1);

      await supabase
         .from('draft')
         .update({ current_pick: currentPick + 1 })
         .match({ league_id: leagueID });

      setDoReset(true);
      setShouldFilterPlayers(true);
   };

   const handleDraftSelection = async (player: Player, teamID?: string) => {
      if (team && player && draft) {
         const { data, error } = await supabase
            .from('draft_selections')
            .insert({
               player_id: player.id,
               team_id: teamID || team.id,
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
      for (const team in turnOrder) {
         if (turnOrder[team].includes(currentPick))
            playerToDraft && handleDraftSelection(playerToDraft, team);
      }
   };

   useEffect(() => {
      if (draftedPlayers.length > 0) {
         for (const player of draftedPlayers) {
            setDraftedIDs((prev) => [...prev, Number(player.player_id)]);
         }
      }
   }, [draftedPlayers]);

   useEffect(() => {
      if (isActive) {
         if (draftedPlayers.length > 0) {
            for (const player of draftedPlayers) {
               if (player.pick === currentPick) {
                  handlePick();
               }
            }
         }
      }
   }, [isActive, draftedPlayers, currentPick]);

   useEffect(() => {
      userTeams &&
         userTeams !== undefined &&
         setTeam(
            userTeams.filter((team: Team) => {
               return team.league_id === leagueID;
            })[0]
         );
   }, [userTeams]);

   useEffect(() => {
      if (numberOfTeams) {
         if (currentPick >= numberOfTeams) {
            setCurrentRound(Math.ceil(currentPick / numberOfTeams));
         } else {
            setCurrentRound(1);
         }
      }
   }, [currentPick, numberOfTeams]);

   useEffect(() => {
      const getCurrentPick = async () => {
         const { data } = await supabase
            .from('draft')
            .select('current_pick')
            .match({ league_id: leagueID });
         data && setCurrentPick(data?.[0].current_pick);
      };
      getCurrentPick();
   }, [leagueID]);

   // add logic for updating after draft pick
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
               setDraftedPlayers((prev) => [
                  ...prev,
                  payload.new as DraftSelection,
               ]);
            }
         )
         .subscribe();

      const fetchDraftedPlayers = async () => {
         if (draft) {
            const { data } = await supabase
               .from('draft_selections')
               .select('*')
               .match({ draft_id: draft.id });
            if (data) {
               data.forEach((draftPick) => {
                  setDraftedPlayers((prev) => [...prev, draftPick]);
               });
            }
            setShouldFetchDraftedPlayers(false);
         }
      };
      if (shouldFetchDraftedPlayers) fetchDraftedPlayers();
      const pickChanel = supabase
         .channel('pick-channel')
         .on(
            'postgres_changes',
            {
               event: 'UPDATE',
               schema: 'public',
               table: 'draft',
               filter: `league_id=eq.${leagueID}`,
            },
            (payload) => {
               setCurrentPick(payload.new.current_pick);
            }
         )
         .subscribe();
   }, [supabase, draft, leagueID]);

   useEffect(() => {
      console.log(draftedPlayers);
   }, [draftedPlayers]);
   useEffect(() => {
      isActive === undefined && draft && setIsActive(draft.is_active);
   }, [draft]);

   useEffect(() => {
      if (isActive) {
         setDoStart(true);
      } else {
         setDoStart(false);
      }
   }, [isActive]);

   useEffect(() => {
      leagues?.forEach((league: League) => {
         if (league.league_id === leagueID) {
            if (league.owner === user?.id) {
               setOwner(true);
            }
         }
      });
      setLeague(
         leagues?.filter((league: League) => {
            return league.league_id === leagueID;
         })[0]
      );
   }, [leagues]);

   useEffect(() => {
      const getTurnOrder = async () => {
         if (league) {
            const { data } = await supabase
               .from('league_rules')
               .select('draft_picks')
               .match({ id: league.league_rules });
            data && setTurnOrder(data?.[0]?.draft_picks);
         }
      };
      const getNumberOfTeams = async () => {
         if (league) {
            const { data } = await supabase
               .from('league_rules')
               .select('number_of_teams')
               .match({ id: league.league_rules });
            data && setNumberOfTeams(Number(data?.[0]?.number_of_teams));
         }
      };
      const getTeams = async () => {
         if (league) {
            const { data } = await supabase
               .from('teams')
               .select('*')
               .match({ league_id: leagueID });
            data && setTeams(data);
         }
      };
      turnOrder.length === 0 && getTurnOrder();
      numberOfTeams === undefined && getNumberOfTeams();
      teams.length === 0 && getTeams();
   }, [league]);

   useEffect(() => {
      if (team) {
         if (turnOrder[team.id] !== undefined) {
            setIsYourTurn(turnOrder[team.id].includes(currentPick) && isActive);
         }
      }
   }, [turnOrder, team, currentPick, isActive]);

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

   useEffect(() => {
      const fetchPlayers = async () => {
         const playersArray = await getPlayers(leagueID);
         setPlayers(playersArray as Player[]);
         setOriginalPlayers(playersArray as Player[]);
         setShouldFilterPlayers(true);
      };
      players.length === 0 && fetchPlayers();
   }, []);

   useEffect(() => {
      shouldFilterPlayers && filterDraftedPlayers();
   }, [shouldFilterPlayers]);

   const tabs: TabProps = {
      tabs: [],
   };

   const timerProps: TimerProps = {
      owner: owner,
      currentPick: currentPick,
      doStart: doStart,
      doReset: doReset,
      setDoReset: setDoReset,
      currentRound: currentRound,
      isActive: isActive,
      autopick: autoDraft,
   };

   const draftOrderProps: DraftOrderProps = {
      draftedPlayers: draftedPlayers,
      currentPick: currentPick,
      teams: teams,
      isYourTurn: isYourTurn,
      turnOrder: turnOrder,
      league: league,
      players: originalPlayers,
      teamID: team?.id || '',
   };

   const watchlistProps: WatchlistProps = {
      updateFeaturedPlayer: updateFeaturedPlayer,
      draftedIDs: draftedIDs,
   };

   const featuredPlayerProps: FeaturedPlayerProps = {
      draftedIDs: draftedIDs,
      featuredPlayer: featuredPlayer || null,
      yourTurn: isYourTurn,
      handleDraftSelection: handleDraftSelection,
   };

   const playerListProps: PlayerListProps = {
      leagueID: leagueID,
      draftedIDs: draftedIDs,
      updateFeaturedPlayer: updateFeaturedPlayer,
      players: players,
   };

   return (
      <div className={classNames('w-full flex flex-row')}>
         {owner && !isActive && (
            <button type="button" onClick={startDraft}>
               Start Draft
            </button>
         )}
         {!isMobile ? (
            <>
               <div className="flex flex-col lg:max-w-[15vw] w-full">
                  <Timer {...timerProps} />
                  <DraftOrder {...draftOrderProps} />
               </div>
               <div className="flex flex-col lg:max-w-[70vw] w-full">
                  <FeaturedPlayer {...featuredPlayerProps} />
                  <PlayerList {...playerListProps} />
               </div>
               <div className="flex flex-col lg:max-w-[15vw] w-full">
                  <Watchlist {...watchlistProps} />
                  <MyTeam />
               </div>{' '}
            </>
         ) : (
            <></>
         )}
      </div>
   );
};
export default Board;
``;
