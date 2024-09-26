'use client';

import { PageContext } from '@/components/context/page-context';
import { NavProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RefObject, useContext, useEffect, useRef, useState } from 'react';

export default function Nav(props: NavProps) {
   const supabase = createClientComponentClient();
   const router = useRouter();
   const { userSignout } = useContext(PageContext);
   const navContainer = useRef<HTMLDivElement>(null);
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const [partyOn, setPartyOn] = useState<boolean>(false);

   const signOut = async () => {
      await supabase.auth.signOut();
      userSignout?.();
      router.refresh();
   };

   const buttonClasses =
      'min-h-full text-white text-bold hover:text-gray-100 dark:bg-gray-light dark:hover:bg-gray-scrollhover p-2 text-center';
   const { user } = useContext(PageContext);
   useOnClickOutside(navContainer, () => setIsOpen(false));
   return (
      <>
         <div
            className={classNames(
               'absolute top-0 r-0 w-dvw h-dvh animate-party opacity-85',
               !partyOn && 'hidden'
            )}
         ></div>
         <nav className="h-[57px] relative z-100">
            <div className="bg-emerald-600 w-full flex justify-center border-b border-b-foreground/10">
               <div className="w-full max-w-4xl flex justify-between items-center p-2 flex-row">
                  <Link
                     className="flex flex-row items-center text-2xl text-white hover:opacity-80 transition-all duration-75"
                     href="/"
                  >
                     <p className="ml-2">Draftaroo</p>
                  </Link>
                  {user?.id ? (
                     <div className="flex flex-col bg-transparent items-center gap-4">
                        <div ref={navContainer} className="w-10 h-10 relative">
                           <button
                              className={
                                 'h-full w-full bg-paper-primary dark:bg-gray-primary text-black dark:text-white text-2xl text-center rounded-full hover:bg-paper-dark dark:hover:bg-gray-dark transition duration-150'
                              }
                              type="button"
                              onClick={() => setIsOpen(!isOpen)}
                           >
                              <span className="text-white hidden lg:block">
                                 {user?.user_metadata?.first_name
                                    ? user.user_metadata.first_name.charAt(0)
                                    : user?.email && user.email.charAt(0)}
                              </span>
                           </button>
                           <div
                              className={classNames(
                                 isOpen && 'animate-show',
                                 !isOpen && 'animate-hide',
                                 'transition duration-150 w-52 absolute top-14 left-[-10rem] shadow-md bg-paper-primary dark:bg-gray-primary rounded-md'
                              )}
                           >
                              <div className="grid grid-cols-2">
                                 <Link
                                    href={'/update-account'}
                                    className={classNames(
                                       'rounded-tl-md',
                                       buttonClasses
                                    )}
                                    onClick={() => setIsOpen(!isOpen)}
                                 >
                                    Manage Account
                                 </Link>

                                 <button
                                    className={classNames(
                                       'rounded-tr-md',
                                       buttonClasses
                                    )}
                                    onClick={() => {
                                       setIsOpen(!isOpen);
                                       signOut();
                                    }}
                                 >
                                    Logout
                                 </button>
                                 <button
                                    className={classNames(
                                       !partyOn && 'animate-party',
                                       'col-span-2 rounded-b-md p-1 text-white'
                                    )}
                                    onClick={() => setPartyOn(!partyOn)}
                                 >
                                    Party {partyOn ? 'Off' : 'Time'}?
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <Link className={buttonClasses} href="/login">
                        Login
                     </Link>
                  )}
               </div>
            </div>
            <div className="sub-nav bg-emerald-500 w-full flex justify-center border-b border-b-foreground/10 h-1"></div>
         </nav>
      </>
   );
}

function useOnClickOutside(
   ref: RefObject<HTMLDivElement>,
   handler: () => void
) {
   useEffect(() => {
      const listener = (event: TouchEvent | MouseEvent) => {
         event;
         if (
            !ref.current ||
            (ref?.current && ref.current.contains(event.target as HTMLElement))
         ) {
            return;
         }
         handler();
      };
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
      return () => {
         document.removeEventListener('mousedown', listener);
         document.removeEventListener('touchstart', listener);
      };
   }, [ref, handler]);
}
