import { cache } from 'react';
import { createClient } from './supabase/server';

export const getUser = cache(async () => {
   const supabase = createClient();

   const {
      data: { user },
   } = await supabase.auth.getUser();

   return user;
});
