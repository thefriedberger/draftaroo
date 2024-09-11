'use client';

import { requestPasswordReset } from '@/app/login/actions';
import { AuthFormProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

const ForgotPasswordForm = (props: AuthFormProps) => {
   const [email, setEmail] = useState('');
   const supabase = createClientComponentClient<Database>();

   const { setFormType } = props;

   // const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
   //    await supabase.auth.resetPasswordForEmail(email, {
   //       redirectTo: `${origin}/account-recovery`,
   //    });
   // };
   return (
      <>
         <form
            className="flex-1 flex flex-col w-full lg:w-96 justify-center gap-2 text-foreground"
            // onSubmit={handleResetPassword}
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
            <input
               className="hidden"
               id="origin"
               name="origin"
               value={origin}
               onChange={() => {}}
            />
            <button
               className="bg-emerald-primary rounded px-4 py-2 text-white mb-3"
               formAction={requestPasswordReset}
            >
               Send recovery link
            </button>
            <div className="flex flex-col lg:flex-row lg:justify-around items-center lg:items-end">
               <button
                  className="underline"
                  onClick={() => setFormType('SIGN_IN')}
               >
                  Sign In
               </button>
               <div className="flex flex-col mt-5 lg:mt-0 text-center lg:text-left items-center lg:items-start">
                  <p className="text-sm text-center">
                     Don&rsquo;t have an account?
                  </p>
                  <button
                     className="underline"
                     onClick={() => setFormType('SIGN_UP')}
                  >
                     Sign Up Now
                  </button>
               </div>
            </div>
         </form>
      </>
   );
};

export default ForgotPasswordForm;
