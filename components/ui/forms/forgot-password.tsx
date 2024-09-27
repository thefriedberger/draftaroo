'use client';

import { requestPasswordReset } from '@/app/login/actions';
import { AuthFormProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

const ForgotPasswordForm = (props: AuthFormProps) => {
   const [email, setEmail] = useState('');
   const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
   const supabase = createClientComponentClient<Database>();

   const { setFormType } = props;

   const handleRequestPasswordReset = async (formData: FormData) => {
      const response = await requestPasswordReset(formData);
      if (!response) {
         setHasSubmitted(false);
      } else {
         setHasSubmitted(true);
      }
   };

   return (
      <>
         <form
            className="flex-1 flex flex-col w-full lg:w-96 justify-center gap-2 text-foreground"
            // onSubmit={handleResetPassword}
         >
            {!hasSubmitted ? (
               <>
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
               </>
            ) : (
               <>
                  <p className="dark:text-white text-center py-2">
                     Recovery email sent
                  </p>
               </>
            )}
            <input
               className="hidden"
               id="origin"
               name="origin"
               value={origin}
               onChange={() => {}}
            />
            <button
               className="bg-emerald-primary rounded px-4 py-2 text-white mb-3 disabled:opacity-85 disabled:cursor-not-allowed"
               formAction={handleRequestPasswordReset}
               disabled={hasSubmitted}
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
