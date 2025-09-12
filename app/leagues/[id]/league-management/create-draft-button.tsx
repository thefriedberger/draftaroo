'use client';

import { createDraft } from '@/app/utils/create-draft';
import { createClient } from '@/app/utils/supabase/client';
import { buttonClasses } from '@/components/ui/helpers/buttons';

const CreateDraftButton = ({ league }) => {
   const supabase = createClient();
   return (
      <button
         onClick={() =>
            createDraft({
               supabase,
               params: {
                  id: league.league_id as string,
               },
            })
         }
         className={buttonClasses}
         type="button"
      >
         Creat Draft
      </button>
   );
};

export default CreateDraftButton;
