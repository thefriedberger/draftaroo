'use client';

import { AuthFormProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useContext, useState } from 'react';
import { PageContext } from '../context/page-context';

const SignInForm = (props: AuthFormProps) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [invalidCredentials, setInvalidCredentials] = useState(false);

   const { updateUser, updateSession } = useContext(PageContext);

   const supabase = createClientComponentClient<Database>();

   const { setFormType, setView } = props;

   const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { data, error } = await supabase.auth.signInWithPassword({
         email,
         password,
      });

      if (error) {
         setInvalidCredentials(true);
      } else {
         setInvalidCredentials(false);
         updateUser?.(data.user);
         if (data.session) updateSession?.(data.session);
      }
   };
   return (
      <>
         <form
            className="flex-1 flex flex-col w-full lg:w-96 justify-center gap-2 text-foreground"
            onSubmit={handleSignIn}
         >
            <label className="text-md" htmlFor="email">
               Email
            </label>
            <input
               className="rounded-md dark:text-white px-4 py-2 bg-inherit border mb-3"
               type="email"
               name="email"
               autoComplete="email"
               onChange={(e) => setEmail(e.target.value)}
               value={email}
               placeholder="you@example.com"
            />
            <label className="text-md" htmlFor="password">
               Password
            </label>
            <input
               className="rounded-md px-4 py-2 dark:text-white  bg-inherit border mb-3"
               type="password"
               name="password"
               onChange={(e) => setPassword(e.target.value)}
               value={password}
               placeholder="••••••••"
            />
            {invalidCredentials && (
               <p className="text-red-700 mb-3">
                  Email or password is incorrect
               </p>
            )}
            <button className="bg-emerald-primary rounded px-4 py-2 text-white mb-3">
               Sign In
            </button>
            <p className="text-sm text-center">
               Don&rsquo;t have an account?
               <button
                  className="ml-1 underline"
                  onClick={() => setFormType('SIGN_UP')}
               >
                  Sign Up Now
               </button>
            </p>
         </form>
      </>
   );
};

export default SignInForm;
