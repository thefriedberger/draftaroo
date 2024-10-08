'use server';

import { UserInvite } from '@/components/ui/team-admin';
import { User, createClient } from '@supabase/supabase-js';

const inviteUser = async (formData: UserInvite) => {
   const { email, callback, teamId, leagueId } = formData;

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
   } = await adminAuthClient.inviteUserByEmail(email, {
      redirectTo: `${callback}?email=${email}`,
   });

   const addUserToTeam = async (user: User) => {
      const { data: teams, error } = await supabase
         .from('teams')
         .update({ owner: user.id })
         .match({ id: teamId });
      if (error) return error;
      return;
   };
   const createProfile = async (user: User, email: string) => {
      await supabase.from('profiles').insert({
         id: user.id,
         email: email,
      });
   };

   if (
      error?.message ===
      'A user with this email address has already been registered'
   ) {
      const { data: users } = await supabase.auth.admin.listUsers();
      users.users.forEach((user) => {
         if (user.email === email) {
            addUserToTeam(user);
            createProfile(user, email);
         }
      });
   } else if (error) {
      return error;
   }

   if (user) {
      addUserToTeam(user);
      createProfile(user, email);
   }
   return;
};

export default inviteUser;
