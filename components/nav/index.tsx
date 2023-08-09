'use client';

import LogoutButton from '@/components/logout-button';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { PageContext } from '../context/page-context';

export interface NavProps {
   user?: User;
}
export default function Nav(props: NavProps) {
   const pathname = usePathname();

   const { updatePrevUrl } = useContext(PageContext);
   useEffect(() => {
      if (pathname === '/login') return;
      updatePrevUrl?.(pathname);
   }, [pathname, updatePrevUrl]);

   return (
      <nav className="bg-emerald-primary w-full flex justify-center border-b border-b-foreground/10 h-16">
         <div className="w-full max-w-4xl flex justify-between items-center p-3 text-foreground flex-row">
            <Link className="text-2xl hover:text-gray-300" href="/">
               Draftaroo
            </Link>
            {props.user?.id ? (
               <div className="flex items-center gap-4">
                  Hey, {props.user.email}!
                  <LogoutButton />
               </div>
            ) : (
               <Link
                  href="/login"
                  className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-sm"
               >
                  Login
               </Link>
            )}
         </div>
      </nav>
   );
}
