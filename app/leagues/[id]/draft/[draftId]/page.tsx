'use server';

import { createDraft } from '@/app/utils/create-draft';
import getPlayers from '@/app/utils/get-players';
import {
   fetchDraft,
   fetchDraftPicks,
   fetchWatchlist,
} from '@/app/utils/helpers';
import Board from '@/components/ui/board';
import AuthModal from '@/components/ui/modals/auth';
import { BoardProps, DraftPick } from '@/lib/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserResponse } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { draftRedirect } from '../actions';

const Draft = async ({
   params,
}: {
   params: { id: string; draftId: string };
}) => {
   const supabase = createServerComponentClient<Database>({ cookies });

   const getDraft = async () => {
      const { data } = await supabase
         .from('draft')
         .select('*')
         .match({ league_id: params.id, id: params.draftId });
      if (data?.[0] && data?.[0].is_completed === true) {
         draftRedirect({ params });
      }

      if (data?.[0]) {
         return data?.[0];
      }
      return null;
   };

   // const getWatchlist = async () => {
   //    const { data: watchlist } = await supabase
   //       .from('watchlist')
   //       .select('*')
   //       .match({ owner: user.id, draft_id: params.draftId });
   //    // if (!watchlist?.length) {
   //    //    await supabase
   //    //       .from('watchlist')
   //    //       .insert({ owner: user?.id, players: [] })
   //    //       .match({})
   //    //       .select('*');
   //    // }
   //    if (watchlist) {
   //       return watchlist?.[0];
   //    }
   // };
   const draft: Awaited<Draft> = await fetchDraft(supabase, params.draftId);
   const { data: user }: Awaited<UserResponse> = await supabase.auth.getUser();
   if (!user?.user)
      return (
         <>
            <h1>You must log in to see this</h1>
            <AuthModal buttonClass="py-2 px-4 rounded-md no-underline" />
         </>
      );
   const watchlist: Awaited<Watchlist> = await fetchWatchlist(
      supabase,
      user.user
   );
   const draftPicks: Awaited<DraftPick[]> = await fetchDraftPicks(
      supabase,
      draft.id
   );
   const players: Awaited<Player[]> = await getPlayers(params.id);

   const boardProps: BoardProps = {
      leagueID: params.id,
      draft: draft,
      watchlist: watchlist,
      user: user.user,
      draftPicks: draftPicks,
      players: players,
   };

   return (
      <>
         {!draft ? (
            <>
               <h1>Looks like you need to make a draft</h1>
               <button
                  onClick={() => createDraft({ supabase, params })}
                  type="button"
               >
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
