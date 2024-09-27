'use client';

import { PageContext } from '@/components/context/page-context';
import { NavProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RefObject, useContext, useEffect, useRef, useState } from 'react';
import { buttonClasses } from '../helpers/buttons';
import NavMenu from './nav-menu';

export default function Nav({ user, userTeams, leagues, drafts }: NavProps) {
   const supabase = createClientComponentClient();
   const router = useRouter();
   const { userSignout } = useContext(PageContext);
   const navContainer = useRef<HTMLDivElement>(null);
   const accountNavContainer = useRef<HTMLDivElement>(null);
   const [accountMenuIsOpen, setAccountMenuIsOpen] = useState<boolean>(false);
   const [navIsOpen, setNavIsOpen] = useState<boolean>(false);
   const [partyOn, setPartyOn] = useState<boolean>(false);

   const signOut = async () => {
      await supabase.auth.signOut();
      userSignout?.();
      router.refresh();
   };

   const buttonClass =
      'min-h-full text-white text-bold hover:text-gray-100 dark:bg-gray-light bg-paper-dark hover:bg-paper-primary dark:hover:bg-gray-scrollhover p-2 text-center';

   useOnClickOutside(navContainer, () => setNavIsOpen(false));
   useOnClickOutside(accountNavContainer, () => setAccountMenuIsOpen(false));

   return (
      <>
         <div
            className={classNames(
               'absolute top-0 r-0 w-dvw h-dvh animate-party-delay opacity-85 z-40',
               !partyOn && 'hidden'
            )}
         ></div>
         {partyOn && (
            <audio className="hidden" controls={false} autoPlay={partyOn}>
               <source src="https://mfiegmjwkqpipahwvcbz.supabase.co/storage/v1/object/sign/audio/sandstorm.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdWRpby9zYW5kc3Rvcm0ubXAzIiwiaWF0IjoxNzI3NDQ4MjY0LCJleHAiOjE4ODUxMjgyNjR9.QGQaxzRMDz_rs4BBTvIIqr035zFlovuxVbrGCoqpPsw&t=2024-09-27T14%3A44%3A24.051Z" />
            </audio>
         )}
         <nav className="h-[57px] relative z-50">
            <div className="bg-emerald-600 w-full flex justify-center border-b border-b-foreground/10">
               <div className="w-full max-w-4xl flex justify-between items-center p-2 flex-row">
                  <div ref={navContainer} className="flex items-center">
                     <button
                        onClick={() => setNavIsOpen(!navIsOpen)}
                        className="h-7 w-8 relative"
                     >
                        <span className="sr-only">Toggle navigation</span>
                        {Array.from({ length: 3 }).map((v, k) => {
                           const positionClass =
                              k === 0
                                 ? navIsOpen
                                    ? 'top-3 -rotate-45'
                                    : 'top-0 -rotate-0'
                                 : k === 1
                                 ? navIsOpen
                                    ? '!bg-transparent'
                                    : 'top-3'
                                 : navIsOpen
                                 ? 'top-3 rotate-45'
                                 : 'top-[1.475rem] rotate-0';
                           return (
                              <div
                                 key={k}
                                 className={classNames(
                                    positionClass,
                                    'w-full h-1 rounded-sm bg-white absolute left-0 transition-all duration-75'
                                 )}
                              ></div>
                           );
                        })}
                     </button>
                     <NavMenu
                        user={user}
                        userTeams={userTeams}
                        leagues={leagues}
                        drafts={drafts}
                        navIsOpen={navIsOpen}
                        setNavIsOpen={setNavIsOpen}
                     />
                  </div>
                  <Link
                     className="flex flex-row items-center text-2xl text-white hover:opacity-80 transition-all duration-75"
                     href="/"
                  >
                     <p className="">Draftaroo</p>
                  </Link>
                  {user?.id ? (
                     <div className="flex flex-col bg-transparent items-center gap-4">
                        <div
                           ref={accountNavContainer}
                           className="w-10 h-10 relative"
                        >
                           <button
                              className={
                                 'h-full w-full bg-paper-primary dark:bg-gray-primary text-black dark:text-white text-2xl text-center rounded-full hover:bg-paper-dark dark:hover:bg-gray-dark transition duration-150'
                              }
                              type="button"
                              onClick={() =>
                                 setAccountMenuIsOpen(!accountMenuIsOpen)
                              }
                           >
                              <span className="text-white block">
                                 {user?.user_metadata?.first_name
                                    ? user.user_metadata.first_name
                                         .charAt(0)
                                         .toLocaleUpperCase()
                                    : user?.email &&
                                      user.email.charAt(0).toLocaleUpperCase()}
                              </span>
                           </button>
                           <div
                              className={classNames(
                                 accountMenuIsOpen && 'animate-show',
                                 !accountMenuIsOpen && 'hidden',
                                 'transition duration-150 w-52 absolute top-14 left-[-10rem] shadow-md bg-paper-primary dark:bg-gray-primary rounded-md'
                              )}
                           >
                              <div className="grid grid-cols-2">
                                 <Link
                                    href={'/update-account'}
                                    className={classNames(
                                       'rounded-tl-md',
                                       buttonClass
                                    )}
                                    onClick={() =>
                                       setAccountMenuIsOpen(!accountMenuIsOpen)
                                    }
                                 >
                                    Manage Account
                                 </Link>

                                 <button
                                    className={classNames(
                                       'rounded-tr-md',
                                       buttonClass
                                    )}
                                    onClick={() => {
                                       setAccountMenuIsOpen(!accountMenuIsOpen);
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
         </nav>
      </>
   );
}

export function useOnClickOutside(
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
