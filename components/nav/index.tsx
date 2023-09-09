'use client';

import LogoutButton from '@/components/logout-button';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useContext } from 'react';
import { PageContext } from '../context/page-context';
import AuthModal from '../modals/auth';

export interface NavProps {
   user?: User;
}
export default function Nav(props: NavProps) {
   const { user } = useContext(PageContext);

   return (
      <>
         <nav className="h-[5vh] min-h-[80px]">
            <div className="bg-emerald-primary w-full flex justify-center border-b border-b-foreground/10">
               <div className="w-full max-w-4xl flex justify-between items-center p-3 text-foreground flex-row">
                  <Link className="text-2xl hover:text-gray-300" href="/">
                     Draftaroo
                  </Link>
                  {user?.id ? (
                     <div className="flex items-center gap-4">
                        <span className="hidden lg:block">
                           Hey, {user.email}!
                        </span>
                        <LogoutButton />
                     </div>
                  ) : (
                     <AuthModal buttonClass="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-sm" />
                  )}
               </div>
            </div>
            <div className="sub-nav bg-emerald-500 w-full flex justify-center border-b border-b-foreground/10 h-2"></div>
         </nav>
      </>
   );
}
