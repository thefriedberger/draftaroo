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
         <nav className="h-[57px]">
            <div className="bg-emerald-600 w-full flex justify-center border-b border-b-foreground/10">
               <div className="w-full max-w-4xl flex justify-between items-center p-2 flex-row">
                  <Link
                     className="flex flex-row items-center text-2xl text-white hover:opacity-80 transition-all duration-75"
                     href="/"
                  >
                     {/* <Roo classes={''} fill="#fff" height="50px" width="50px" /> */}
                     <p className="ml-2">Draftaroo</p>
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
            <div className="sub-nav bg-emerald-500 w-full flex justify-center border-b border-b-foreground/10 h-1"></div>
         </nav>
      </>
   );
}
