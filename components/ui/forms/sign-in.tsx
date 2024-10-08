'use client';

import { login } from '@/app/login/actions';
import Link from 'next/link';
import { useState } from 'react';

const SignInForm = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [invalidCredentials, setInvalidCredentials] = useState(false);

   const handleSubmit = async (formData: FormData) => {
      const response = await login(formData);
      if (response.status !== 200) {
         setInvalidCredentials(true);
      } else {
         setInvalidCredentials(false);
      }
   };

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
               formAction={handleSubmit}
               type={'submit'}
            >
               Sign In
            </button>

            <div className="flex flex-col lg:flex-row lg:justify-around lg:items-end">
               <Link className="underline" href="/auth/forgot-password">
                  Forgot Password
               </Link>
               <div className="flex flex-col mt-5 lg:mt-0 text-center lg:text-left items-center lg:items-start">
                  <p className="text-sm text-center">
                     Don&rsquo;t have an account?
                  </p>
                  <Link className="underline" href="/auth/sign-up">
                     Sign Up Now
                  </Link>
               </div>
            </div>
         </form>
      </>
   );
};

export default SignInForm;
