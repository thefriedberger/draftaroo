'use client';

import { PageContext } from '@/components/context/page-context';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useContext, useState } from 'react';

const SetPassword = () => {
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
   const [password, setPassword] = useState<string>('');
   const [firstName, setFirstName] = useState<string>('');
   const [lastName, setLastName] = useState<string>('');
   const [verifyPassword, setVerifyPassword] = useState('');
   const [passwordsMatch, setPasswordsMatch] = useState(true);
   const router = useRouter();
   const { user } = useContext(PageContext);

   const checkPassword = (e: ChangeEvent<HTMLInputElement>) => {
      if (e?.target?.value === password) {
         setPasswordsMatch(true);
      } else {
         setPasswordsMatch(false);
      }
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const leagueID = new URL(location.href).searchParams.get('leagueID');
      if (user) {
         const email = String(user.email);
         const { error } = await adminAuthClient.updateUserById(user.id, {
            password: password,
            user_metadata: {
               first_name: firstName,
               last_name: lastName,
            },
         });
         console.log(error);
         const { data } = await supabase.auth.signInWithPassword({
            email,
            password,
         });
         //   data.user && updateUser?.(data.user);
         //   data.session && updateSession?.(data.session);

         setTimeout(() => {
            if (leagueID !== undefined || leagueID) {
               router.push(`${location.origin}/leagues/${leagueID}`);
            } else {
               router.push(`${location.origin}`);
            }
         }, 500);
      }
   };
   return (
      <>
         {user && (
            <>
               <form
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                     handleSubmit(e)
                  }
                  className=""
               >
                  <div className="flex flex-col">
                     <label
                        htmlFor="first_name"
                        className="text-black dark:text-white"
                     >
                        First Name:
                     </label>
                     <input
                        className="rounded-md px-4 py-2 dark:text-white bg-inherit border mb-3"
                        id="first_name"
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                     />
                     <label
                        htmlFor="last_name"
                        className="text-black dark:text-white"
                     >
                        Last Name:
                     </label>
                     <input
                        className="rounded-md px-4 py-2 dark:text-white bg-inherit border mb-3"
                        id="last_name"
                        onChange={(e) => setLastName(e.target.value)}
                        required
                     />
                     <label
                        htmlFor={'password'}
                        className="text-black dark:text-white"
                     >
                        Set your password:
                     </label>
                     <input
                        className="rounded-md px-4 py-2 dark:text-white bg-inherit border mb-3"
                        type="password"
                        name="password"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                           setPassword(e.target.value);
                           checkPassword(e);
                        }}
                        required
                        value={password}
                        placeholder="••••••••"
                     />
                     <label
                        className="text-black dark:text-white"
                        htmlFor="verify-password"
                     >
                        Verify Password
                     </label>
                     <input
                        className={`rounded-md px-4 py-2 dark:text-white bg-inherit border ${
                           !passwordsMatch ? 'mb-0' : 'mb-3'
                        }`}
                        type="password"
                        name="verify-password"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                           setVerifyPassword(e.target.value);
                           checkPassword(e);
                        }}
                        value={verifyPassword}
                        placeholder="••••••••"
                     />
                     {!passwordsMatch && (
                        <p className="text-red-700 mb-3">
                           Passwords must match
                        </p>
                     )}

                     <button
                        type="submit"
                        className="bg-white disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-md p-1 mt-2"
                        disabled={!passwordsMatch}
                     >
                        Submit
                     </button>
                  </div>
               </form>
            </>
         )}
      </>
   );
};

export default SetPassword;
