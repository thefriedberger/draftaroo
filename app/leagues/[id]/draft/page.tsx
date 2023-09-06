'use client';

import Board from '@/components/board';
import { PageContext } from '@/components/context/page-context';
import { BoardProps, TimerProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

const Draft = ({ params }: { params: { id: string } }) => {
   const [draft, setDraft] = useState<Draft | any>();
   const [hostTimer, setHostTimer] = useState<string | number>();
   const [timer, setTimer] = useState<string | number>();
   const [timerTimeout, setTimerTimeout] = useState<any>();
   const [owner, setOwner] = useState<boolean>(false);
   const [league, setLeague] = useState<League>();
   const { session, user, team, teams, leagues } = useContext(PageContext);
   const router = useRouter();
   const supabase = createClientComponentClient<Database>();
   const TIMER_DURATION = 120;

   const getDraft = async () => {
      const { data } = await supabase
         .from('draft')
         .select('*')
         .match({ league_id: params.id });
      if (data) setDraft(data);
   };

   const createDraft = async () => {
      const { data, error } = await supabase.from('draft').insert({
         league_id: params.id,
      });
   };
   useEffect(() => {
      leagues?.forEach((league: League) => {
         if (league.league_id === params.id) {
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
   useEffect(() => {
      getDraft();
   }, [createDraft]);

   // useEffect(() => {
   //    const channelC = supabase.channel('room-2', {
   //       config: {
   //          broadcast: {
   //             self: true,
   //          },
   //       },
   //    });
   //    channelC.on('broadcast', { event: 'timer' }, (payload) => {
   //       console.log(payload);
   //       if (payload) setTimer(payload.payload.message);
   //    });

   //    channelC.subscribe((status) => {
   //       if (status === 'SUBSCRIBED') {
   //          channelC.send({
   //             type: 'broadcast',
   //             event: 'timer',
   //             payload: { message: hostTimer },
   //          });
   //       }
   //    });
   // }, [hostTimer]);

   const timerProps: TimerProps = {
      owner: owner,
      currentPick: 1,
   };

   const boardProps: BoardProps = {
      timer: timerProps,
      leagueID: params.id,
   };
   return (
      <>
         {draft && draft.length === 0 ? (
            <>
               <h1>Looks like you need to make a draft</h1>
               <button onClick={createDraft} type="button">
                  Creat Draft
               </button>
            </>
         ) : (
            <>
               <Board {...boardProps} />
            </>
         )}
      </>
   );
};

export default Draft;
