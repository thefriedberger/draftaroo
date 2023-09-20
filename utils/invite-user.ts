'use server';

import { UserInvite } from '@/components/team/admin';
import { User, createClient } from '@supabase/supabase-js';

const inviteUser = async (formData: UserInvite) => {
   const { email, callback, teamId } = formData;

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

   const addUserToTeam = async (user: User) => {
      const { data: teams, error } = await supabase
         .from('teams')
         .update({ owner: user.id })
         .match({ id: teamId });
      console.log(error);
      if (error) return 204;
      return 200;
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
   }

   if (user) {
      addUserToTeam(user);
      createProfile(user, email);
   }
   return 200;
};

export default inviteUser;
