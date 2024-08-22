import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const getUser = cache(async () => {
   const supabase = createServerComponentClient<Database>({ cookies });

   const {
      data: { user },
   } = await supabase.auth.getUser();

   return user;
});
