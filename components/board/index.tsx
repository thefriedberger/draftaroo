'use client';

import { BoardProps, TimerProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
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
   const [hostTimer, setHostTimer] = useState<string | number>();
   const [timer, setTimer] = useState<string | number>();
   const [timerStatus, setTimerStatus] = useState<TIMER_STATUS>(
      TIMER_STATUS.STOP
   );
   const [timerTimeout, setTimerTimeout] = useState<any>();
   const [owner, setOwner] = useState<boolean>(false);
   const [draftedPlayers, setDraftedPlayers] = useState<number[]>([]);
   const [league, setLeague] = useState<League>();
   const [shouldFetchDraftedPlayers, setShouldFetchDraftedPlayers] =
      useState<boolean>(true);
   const { session, user, team, teams, leagues } = useContext(PageContext);
   const router = useRouter();

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

   const startTimer = () => {
      const timestamp = Date.now() / 1000;
      console.log(timestamp);
      const timeLeft =
         TIMER_DURATION - (Math.round(timestamp) % TIMER_DURATION);
      setHostTimer(timeLeft);

      const timeCorrection = Math.round(timestamp) - timestamp;
      setTimerTimeout(setTimeout(startTimer, timeCorrection * 1000 + 1000));
   };
   const resetTimer = () => {
      setTimerTimeout(clearTimeout(timerTimeout));
      setHostTimer(TIMER_DURATION);
   };

   const handleDraftSelection = async (player: Player) => {
      if (team && player && draft) {
         const { data, error } = await supabase
            .from('draft_selections')
            .insert({
               player_id: player.id,
               team_id: team[0].id,
               draft_id: draft.id,
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
               let tempPlayers = [];
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

   useEffect(() => {
      console.log(draftedPlayers);
   }, [draftedPlayers]);

   const timerProps: TimerProps = {
      owner: owner,
      currentPick: 1,
      status: timerStatus,
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
