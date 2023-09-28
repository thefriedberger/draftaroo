'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { PageContext } from '../context/page-context';

export default function LogoutButton() {
   const router = useRouter();
   const { userSignout } = useContext(PageContext);
   const supabase = createClientComponentClient();

   const signOut = async () => {
      await supabase.auth.signOut();
      userSignout?.();
      router.refresh();
   };

   return (
      <button
         className="py-2 px-4 rounded-md no-underline bg-white dark:text-white dark:bg-gray-dark dark:hover:bg-gray-primary"
         onClick={signOut}
      >
         Logout
      </button>
   );
}
