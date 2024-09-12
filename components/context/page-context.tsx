'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export type PageContextType = {
   session?: Session;
   updateSession?: (newSession: Session) => void;
   user?: User;
   updateUser?: (newUser: User) => void;
   profile?: Profile | any;
   udpateProfile?: (newProfile: Profile | any) => void;
   userSignout?: () => void;
};

const initialValues = {};

interface Props {
   user?: User;
   children: React.ReactNode;
}
export enum WatchlistAction {
   ADD = 'add',
   UPDATE = 'update',
   DELETE = 'delete',
}
export const PageContext = React.createContext<PageContextType>(initialValues);

export const PageContextProvider: React.FC<Props> = ({ user, children }) => {
   const [session, setSession] = React.useState<Session | any>();
   const [profile, setProfile] = React.useState<Profile | any>();

   const router = useRouter();

   const updateSession = (newSession: Session) => {
      setSession(newSession);
      router.refresh();
   };
   const udpateProfile = (newProfile: Profile) => {
      setProfile(newProfile);
   };

   const fetchProfile = async () => {
      const supabase = createClientComponentClient<Database>();
      const { data, error } = await supabase
         .from('profiles')
         .select('*')
         .match({ id: user?.id });
      if (data) setProfile(data);
   };

   const userSignout = () => {
      setSession(null);
      setProfile(null);
      router.refresh();
   };
   useEffect(() => {
      if (user?.id && !profile) fetchProfile();
   }, [user]);

   return (
      <PageContext.Provider
         value={{
            user,
            session,
            updateSession,
            profile,
            udpateProfile,
            userSignout,
         }}
      >
         {children}
      </PageContext.Provider>
   );
};
