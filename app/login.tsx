'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function Login() {
   const router = useRouter();
   const supabase = createClientComponentClient<Database>();

   const handleSignUp = async () => {
      await supabase.auth.signUp({
         email: 'thefriedberger@gmail.com',
         password: 'Dogpig12!',
         options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
         },
      });
      router.refresh();
   };

   const handleSignIn = async () => {
      await supabase.auth.signInWithPassword({
         email: 'thefriedberger@gmail.com',
         password: 'Dogpig12!',
      });
      router.refresh();
   };

   const handleSignOut = async () => {
      await supabase.auth.signOut();
      router.refresh();
   };

   return (
      <div className="flex gap-2">
         <button className="bg-white rounded-sm p-1" onClick={handleSignUp}>
            Sign up
         </button>
         <button className="bg-white rounded-sm p-1" onClick={handleSignIn}>
            Sign in
         </button>
         <button className="bg-white rounded-sm p-1" onClick={handleSignOut}>
            Sign out
         </button>
      </div>
   );
}
