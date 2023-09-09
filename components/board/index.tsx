'use client';

import { BoardProps, TabProps, TimerProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
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
   const [league, setLeague] = useState<League>();
   const [shouldFetchDraftedPlayers, setShouldFetchDraftedPlayers] =
      useState<boolean>(true);
   const { user, team, teams, leagues } = useContext(PageContext);

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
   }, [leagues]);

   const handleDraftSelection = async (player: Player) => {
      if (team && player && draft) {
         const { data, error } = await supabase
            .from('draft_selections')
            .insert({
               player_id: player.id,
               team_id: team[0].id,
               draft_id: draft.id,
               round: currentPick,
               pick: currentRound,
            });
         if (error) console.log(error);
         if (data) console.log(data);
      }
   };

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
                  console.log(draftPick);
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
   }, [supabase, draft]);

   const timerProps: TimerProps = {
      owner: owner,
      currentPick: 1,
      status: timerStatus,
   };
   const tabs: TabProps = {
      tabs: [],
   };
   return (
      <div className={classNames('w-full flex flex-row')}>
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
         </div>
      </div>
   );
};
export default Board;
``;
