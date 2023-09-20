'use client';

import { BoardProps, TabProps, TimerProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { PageContext } from '../context/page-context';
import DraftOrder from '../draft-order';
import FeaturedPlayer from '../featured-player';
import MyTeam from '../my-team';
import PlayerList from '../player-list';
import Timer from '../timer';
import Watchlist from '../watchlist';

const Board = (props: BoardProps) => {
   const supabase = createClientComponentClient<Database>();
   const { leagueID, draft } = props;

   const [featuredPlayer, setFeaturedPlayer] = useState<Player>();
   const [isYourTurn, setIsYourTurn] = useState<boolean>(false);
   const [doStart, setDoStart] = useState<boolean>(false);
   const [currentPick, setCurrentPick] = useState<number>(1);
   const [currentRound, setCurrentRound] = useState<number>(1);
   const [owner, setOwner] = useState<boolean>(false);
   const [draftedPlayers, setDraftedPlayers] = useState<number[]>([]);
   const [league, setLeague] = useState<League | any>();
   const [turnOrder, setTurnOrder] = useState<any>([]);
   const [team, setTeam] = useState<Team | any>(null);
   const [numberOfTeams, setNumberOfTeams] = useState<number>();
   const [shouldFetchDraftedPlayers, setShouldFetchDraftedPlayers] =
      useState<boolean>(true);
   const [isActive, setIsActive] = useState<boolean>(draft?.is_active);
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

   const autoDraft = async () => {};

   const handleDraftSelection = async (player: Player) => {
      if (team && player && draft) {
         const { data, error } = await supabase
            .from('draft_selections')
            .insert({
               player_id: player.id,
               team_id: team.id,
               draft_id: draft.id,
               round: currentPick,
               pick: currentRound,
            });
         if (error) {
            console.log(error);
            return;
         }
         setCurrentPick(currentPick + 1);

         await supabase
            .from('draft')
            .update({ current_pick: currentPick + 1 })
            .match({ league_id: leagueID });

         setDoStart(false);
      }
   };

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
         if (currentPick < numberOfTeams) {
            setCurrentRound(Math.floor(currentPick / numberOfTeams));
         } else {
            setCurrentRound(1);
         }
      }
   }, [currentPick, numberOfTeams]);

   useEffect(() => {
      console.log(draftedPlayers);
   }, [draftedPlayers]);

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
      const fetchDraftedPlayers = async () => {
         if (draft) {
            const { data } = await supabase
               .from('draft_selections')
               .select('*')
               .match({ draft_id: draft.id });
            if (data) {
               data.forEach((draftPick) => {
                  setDraftedPlayers((prev) => [
                     ...prev,
                     Number(draftPick.player_id),
                  ]);
               });
            }
            setShouldFetchDraftedPlayers(false);
         }
      };
      if (shouldFetchDraftedPlayers) fetchDraftedPlayers();
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
               setDraftedPlayers((prev) => [...prev, payload.new.player_id]);
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
               filter: `league_id=eq.${leagueID}`,
            },
            (payload) => {
               setCurrentPick(payload.new.current_pick);
            }
         )
         .subscribe();
   }, [supabase, draft, leagueID]);

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
         })
      );
   }, [leagues]);

   useEffect(() => {
      const getTurnOrder = async () => {
         if (league) {
            const { data } = await supabase
               .from('league_rules')
               .select('draft_picks')
               .match({ id: league[0].league_rules });
            data && setTurnOrder(data?.[0]?.draft_picks);
         }
      };
      const getNumberOfTeams = async () => {
         if (league) {
            const { data } = await supabase
               .from('league_rules')
               .select('number_of_teams')
               .match({ id: league[0].league_rules });
            data && setNumberOfTeams(Number(data?.[0]?.number_of_teams));
         }
      };
      turnOrder.length === 0 && getTurnOrder();
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

   const timerProps: TimerProps = {
      owner: owner,
      currentPick: currentPick,
      doStart: doStart,
      currentRound: currentRound,
      isActive: isActive,
   };
   const tabs: TabProps = {
      tabs: [],
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
                  <DraftOrder />
               </div>
               <div className="flex flex-col lg:max-w-[70vw] w-full">
                  <FeaturedPlayer
                     featuredPlayer={featuredPlayer || null}
                     yourTurn={isYourTurn}
                     handleDraftSelection={handleDraftSelection}
                     draftedPlayers={draftedPlayers}
                  />
                  <PlayerList
                     leagueID={leagueID}
                     updateFeaturedPlayer={updateFeaturedPlayer}
                     draftedPlayers={draftedPlayers}
                  />
               </div>
               <div className="flex flex-col lg:max-w-[15vw] w-full">
                  <Watchlist
                     updateFeaturedPlayer={updateFeaturedPlayer}
                     draftedPlayers={draftedPlayers}
                  />
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
