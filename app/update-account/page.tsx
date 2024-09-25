'use client';

import { PageContext } from '@/components/context/page-context';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

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
   const [firstName, setFirstName] = useState<string>('');
   const [lastName, setLastName] = useState<string>('');
   const router = useRouter();
   const { user } = useContext(PageContext);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const leagueID = new URL(location.href).searchParams.get('leagueID');
      if (user) {
         const email = String(user.email);
         const { error } = await adminAuthClient.updateUserById(user.id, {
            user_metadata: {
               first_name: firstName,
               last_name: lastName,
            },
         });

         router.refresh();
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

                     <button
                        type="submit"
                        className="bg-white disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-md p-1 mt-2"
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
