'use client';

import { PageContext } from '@/components/context/page-context';
import { UserProps } from '@/lib/types';
import addUser from '@/utils/add-user';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useContext, useState } from 'react';

export type formStatus = 'VIEW_FORM' | 'CHECK_EMAIL';

export type formType = 'SIGN_IN' | 'SIGN_UP';

export default function Login() {
   const [view, setView] = useState<formStatus>('VIEW_FORM');
   const [formType, setFormType] = useState<formType>('SIGN_IN');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [verifyPassword, setVerifyPassword] = useState('');
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [username, setUsername] = useState('');

   const [passwordsMatch, setPasswordsMatch] = useState(true);

   const router = useRouter();
   const supabase = createClientComponentClient<Database>();

   const { prevUrl } = useContext(PageContext);

   const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const userProps: UserProps = {
         email: email,
         password: password,
         firstName: firstName,
         lastName: lastName,
         username: username,
         origin: location.origin,
      };
      const didSubmit = await addUser(userProps);
      setView(didSubmit);
   };

   const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await supabase.auth.signInWithPassword({
         email,
         password,
      });

      if (prevUrl) {
         router.push(prevUrl);
      } else {
         router.push('/');
      }
      router.refresh();
   };

   const checkPassword = (e: ChangeEvent<HTMLInputElement>) => {
      setVerifyPassword(e.target.value);
      if (e?.target?.value === password) {
         setPasswordsMatch(true);
      } else {
         setPasswordsMatch(false);
      }
   };

   return (
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
         <Link
            href="/"
            className="absolute left-8 top-4 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
               className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
            >
               <polyline points="15 18 9 12 15 6" />
            </svg>{' '}
            Back
         </Link>
         {view === 'CHECK_EMAIL' ? (
            <p className="text-center text-foreground">
               Check <span className="font-bold">{email}</span> to continue
               signing up
            </p>
         ) : (
            <form
               className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
               onSubmit={formType === 'SIGN_IN' ? handleSignIn : handleSignUp}
            >
               {formType === 'SIGN_UP' && (
                  <>
                     <label className="text-md" htmlFor="username">
                        Username
                     </label>
                     <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6"
                        type="text"
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        placeholder=""
                     />
                     <label className="text-md" htmlFor="first-name">
                        First Name
                     </label>
                     <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6"
                        type="text"
                        name="first-name"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                        placeholder="Joe"
                     />
                     <label className="text-md" htmlFor="last-name">
                        Last Name
                     </label>
                     <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6"
                        type="text"
                        name="last-name"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                        placeholder="Mama"
                     />
                  </>
               )}
               <label className="text-md" htmlFor="email">
                  Email
               </label>
               <input
                  className="rounded-md px-4 py-2 bg-inherit border mb-6"
                  type="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="you@example.com"
               />
               <label className="text-md" htmlFor="password">
                  Password
               </label>
               <input
                  className="rounded-md px-4 py-2 bg-inherit border mb-6"
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="••••••••"
               />
               {formType === 'SIGN_UP' && (
                  <>
                     <label className="text-md" htmlFor="verify-password">
                        Verify Password
                     </label>
                     <input
                        className={`rounded-md px-4 py-2 bg-inherit border ${
                           !passwordsMatch ? 'mb-0' : 'mb-6'
                        }`}
                        type="password"
                        name="verify-password"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                           checkPassword(e)
                        }
                        value={verifyPassword}
                        placeholder="••••••••"
                     />
                  </>
               )}
               {!passwordsMatch && formType === 'SIGN_UP' && (
                  <p className="text-red-700 mb-6">Passwords must match</p>
               )}

               {formType === 'SIGN_IN' && (
                  <>
                     <button className="bg-emerald-700 rounded px-4 py-2 text-white mb-6">
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
                  </>
               )}
               {formType === 'SIGN_UP' && (
                  <>
                     <button
                        className={`${
                           !passwordsMatch ? 'opacity-30' : ''
                        } bg-emerald-700 rounded px-4 py-2 text-white mb-6`}
                        disabled={!passwordsMatch}
                     >
                        Sign Up
                     </button>
                     <p className="text-sm text-center">
                        Already have an account?
                        <button
                           className="ml-1 underline"
                           onClick={() => setFormType('SIGN_IN')}
                        >
                           Sign In Now
                        </button>
                     </p>
                  </>
               )}
            </form>
         )}
      </div>
   );
}
