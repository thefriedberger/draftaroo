'use client';

import Board from '@/components/board';
import { BoardProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

const Draft = ({ params }: { params: { id: string } }) => {
   const [draft, setDraft] = useState<Draft | any>(null);
   const supabase = createClientComponentClient<Database>();

   const getDraft = async () => {
      const { data } = await supabase
         .from('draft')
         .select('*')
         .match({ league_id: params.id });
      if (data?.[0]) setDraft(data?.[0]);
   };

   const createDraft = async () => {
      await supabase.from('draft').insert({
         league_id: params.id,
      });
   };
   useEffect(() => {
      if (!draft) getDraft();
   }, [draft, createDraft]);

   const boardProps: BoardProps = {
      leagueID: params.id,
      draft: draft,
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
