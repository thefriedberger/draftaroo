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

export const TIMER_DURATION = 120;
export enum TIMER_STATUS {
   START = 'start',
   STOP = 'stop',
   RESET = 'reset',
}

const Board = (props: BoardProps) => {
   const supabase = createClientComponentClient<Database>();
   const { leagueID, draft } = props;

   const [featuredPlayer, setFeaturedPlayer] = useState<Player>();
   const [isYourTurn, setIsYourTurn] = useState<boolean>(false);
   const [timerStatus, setTimerStatus] = useState<TIMER_STATUS>(
      TIMER_STATUS.STOP
   );
   const [currentPick, setCurrentPick] = useState<number>(1);
   const [currentRound, setCurrentRound] = useState<number>(1);
   const [owner, setOwner] = useState<boolean>(false);
   const [draftedPlayers, setDraftedPlayers] = useState<number[]>([]);
   const [league, setLeague] = useState<League | any>();
   const [turnOrder, setTurnOrder] = useState<any>([]);
   const [team, setTeam] = useState<Team | any>(null);
   const [shouldFetchDraftedPlayers, setShouldFetchDraftedPlayers] =
      useState<boolean>(true);
   const { user, userTeams, teams, leagues } = useContext(PageContext);

   const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

   const updateFeaturedPlayer = (player: Player) => {
      setFeaturedPlayer(player);
   };

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
      turnOrder.length === 0 && getTurnOrder();
   }, [league]);

   useEffect(() => {
      if (team) {
         if (turnOrder[team.id] !== undefined) {
            console.log(team.id);
            setIsYourTurn(turnOrder[team.id].includes(currentPick));
         }
      }
   }, [turnOrder, team, currentPick]);

   useEffect(() => {
      console.log(isYourTurn);
   }, [isYourTurn]);

   useEffect(() => {
      userTeams &&
         userTeams !== undefined &&
         setTeam(
            userTeams.filter((team: Team) => {
               return team.league_id === leagueID;
            })[0]
         );
   }, [userTeams]);

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
         data && console.log(data);
         setCurrentPick(currentPick + 1);
         await supabase.from('draft').update({ current_pick: currentPick + 1 });

         await supabase
            .from('draft')
            .update({ current_pick: currentPick + 1 })
            .match({ league_id: leagueID });
      }
   };

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
               filter: `draft_id=eq.${draft ? draft.id : ''}`,
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
   }, [supabase, draft]);

   const timerProps: TimerProps = {
      owner: owner,
      currentPick: currentPick,
      status: timerStatus,
   };
   const tabs: TabProps = {
      tabs: [],
   };
   return (
      <div className={classNames('w-full flex flex-row')}>
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
