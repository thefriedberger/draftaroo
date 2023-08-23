'use server';

import { EmailInvite } from '@/app/leagues/tabs/teams';
import { User, createClient } from '@supabase/supabase-js';

const inviteUser = async (formData: EmailInvite) => {
   const { email, callback, leagueId, teamName } = formData;

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

   const createTeam = async (user: User) => {
      const { data: teams } = await supabase
         .from('teams')
         .select('*')
         .match({ owner: user.id });
      console.log(teams);
      await supabase.from('teams').insert({
         owner: user.id,
         team_name: teamName,
         league_id: leagueId,
      });
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
      console.log(users);
      users.users.forEach((user) => {
         if (user.id === user.id) {
            createTeam(user);
            createProfile(user, email);
         }
      });
   }

   if (error) return { error };

   if (user) {
      createTeam(user);
      createProfile(user, email);
   }
   return { user };
};

export default inviteUser;
