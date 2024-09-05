'use client';

import { PageContext } from '@/components/context/page-context';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { buttonClasses } from '../helpers/buttons';

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
      <button className={buttonClasses} onClick={signOut}>
         Logout
      </button>
   );
}
