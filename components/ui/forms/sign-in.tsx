'use client';

import { login } from '@/app/login/actions';
import { AuthFormProps } from '@/lib/types';
import { useState } from 'react';

const SignInForm = (props: AuthFormProps) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [invalidCredentials, setInvalidCredentials] = useState(false);

   const { setFormType } = props;

   return (
      <>
         <form className="flex-1 flex flex-col w-full lg:w-96 justify-center gap-2 text-foreground">
            <label className="text-md" htmlFor="email">
               Email
            </label>
            <input
               className="rounded-md dark:invert dark:border-black  px-4 py-2 bg-inherit border mb-3"
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
               className="rounded-md px-4 py-2 bg-inherit dark:invert border dark:border-black mb-3"
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
            <button
               className="bg-emerald-primary rounded px-4 py-2 text-white mb-3"
               formAction={login}
               type={'submit'}
            >
               Sign In
            </button>

            {setFormType && (
               <div className="flex flex-col md:flex-row md:justify-around md:items-end">
                  <button
                     className="underline"
                     onClick={() => setFormType('FORGOT_PASSWORD')}
                  >
                     Forgot Password
                  </button>
                  <div className="flex flex-col mt-5 md:mt-0 text-center md:text-left items-center md:items-start">
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
            )}
         </form>
      </>
   );
};

export default SignInForm;
