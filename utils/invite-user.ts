'use server';

import { EmailInvite } from '@/app/leagues/[id]/tabs/teams';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const inviteUser = async (formData: EmailInvite) => {
   const { email, callback, leagueId } = formData;

   const supabase = createClient(
      String(process.env.NEXT_PUBLIC_SUPABASE_URL),
      String(process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY),
      {
         auth: {
            autoRefreshToken: false,
            persistSession: false,
         },
      }
   );
   // Access auth admin api
   const adminAuthClient = supabase.auth.admin;
   const {
      data: { user },
      error,
   } = await adminAuthClient.inviteUserByEmail(email, { redirectTo: callback });

   revalidatePath(`/leagues/${leagueId}`);
   if (error) return { error };
   return { user };
};

export default inviteUser;
