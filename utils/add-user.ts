'use server';
import { UserProps } from '@/lib/types';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const addUser = async (props: UserProps) => {
   const supabase = createServerActionClient<Database>({ cookies });
   const { firstName, lastName, username, email, password, origin } = props;
   const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
         emailRedirectTo: `${origin}/auth/callback`,
         data: {
            first_name: firstName,
            last_name: lastName,
            username: username,
         },
      },
   });
   console.log(error);
   if (error) return 'VIEW_FORM';
   return 'CHECK_EMAIL';
};

export default addUser;
