'use client';

import Board from '@/components/ui/board';
import { BoardProps } from '@/lib/types';
import { createDraft } from '@/utils/create-draft';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { draftRedirect } from '../actions';

const Draft = ({ params }: { params: { id: string; draftId: string } }) => {
   const [draft, setDraft] = useState<Draft | any>(null);
   const supabase = createClientComponentClient<Database>();

   const getDraft = async () => {
      const { data } = await supabase
         .from('draft')
         .select('*')
         .match({ league_id: params.id, id: params.draftId });
      if (data?.[0] && data?.[0].is_completed === true)
         draftRedirect({ params });
      if (data?.[0]) setDraft(data?.[0]);
   };

   useEffect(() => {
      if (!draft) getDraft();
   }, [draft, createDraft]);

   const boardProps: BoardProps = {
      leagueID: params.id,
      draft: draft,
   };

   console.log(params);
   return (
      <>
         {draft && draft.length === 0 ? (
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
