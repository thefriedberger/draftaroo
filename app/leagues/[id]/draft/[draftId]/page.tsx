'use server';

import { createDraft } from '@/app/utils/create-draft';
import { getUser } from '@/app/utils/get-user';
import Board from '@/components/ui/board';
import { BoardProps, watchlist } from '@/lib/types';
import {
   User,
   createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
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
   const getWatchlist = async () => {
      const { data: watchlist } = await supabase
         .from('watchlist')
         .select('*')
         .match({ owner: user?.id, draft_id: params.draftId });
      // if (!watchlist?.length) {
      //    await supabase
      //       .from('watchlist')
      //       .insert({ owner: user?.id, players: [] })
      //       .match({})
      //       .select('*');
      // }
      if (watchlist) {
         return watchlist?.[0];
      }
   };
   const draft = await getDraft();
   const user: User | null = await getUser();
   const watchlist: watchlist = user && (await getWatchlist());

   const boardProps: BoardProps = {
      leagueID: params.id,
      draft: draft,
      watchlist: watchlist,
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
