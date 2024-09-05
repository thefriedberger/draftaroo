'use client';

import { PageContext } from '@/components/context/page-context';
import LogoutButton from '@/components/ui/logout-button';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useContext } from 'react';
import { buttonClasses } from '../helpers/buttons';
import AuthModal from '../modals/auth';

export interface NavProps {
   user?: User;
}
export default function Nav(props: NavProps) {
   const { user } = useContext(PageContext);

   return (
      <>
         <nav className="h-[5dvh] min-h-[74px]">
            <div className="bg-emerald-600 w-full flex justify-center border-b border-b-foreground/10">
               <div className="w-full max-w-4xl flex justify-between items-center p-3 flex-row">
                  <Link
                     className="text-2xl text-white dark:hover:text-gray-300"
                     href="/"
                  >
                     Draftaroo
                  </Link>
                  {user?.id ? (
                     <div className="flex items-center gap-4">
                        <span className="text-white hidden lg:block">
                           Hey, {user.user_metadata.first_name || user.email}!
                        </span>
                        <LogoutButton />
                     </div>
                  ) : (
                     <AuthModal buttonClass={buttonClasses} />
                  )}
               </div>
            </div>
            <div className="sub-nav bg-emerald-500 w-full flex justify-center border-b border-b-foreground/10 h-2"></div>
         </nav>
      </>
   );
}
