import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { cache } from 'react';

export const getUser = cache(async () => {
   const supabase = createClientComponentClient<Database>();

   const {
      data: { user },
   } = await supabase.auth.getUser();

   return user;
});
