'use client';

import { Session, User } from '@supabase/supabase-js';
import React from 'react';

export type PageContextType = {
   prevUrl?: string;
   updatePrevUrl?: (url: string) => string;
   session?: Session;
   updateSession?: (newSession: Session) => void;
   user?: User;
   updateUser?: (newUser: User) => void;
};

const initialValues = {
   prevUrl: '/',
};

interface Props {
   children: React.ReactNode;
}

export const PageContext = React.createContext<PageContextType>(initialValues);

export const PageContextProvider: React.FC<Props> = ({ children }) => {
   const [prevUrl, setPrevUrl] = React.useState<string>('');
   const [session, setSession] = React.useState<Session>();
   const [user, setUser] = React.useState<User>();

   const updatePrevUrl = (url: string) => {
      setPrevUrl(url);
      return url;
   };
   const updateSession = (newSession: Session) => {
      setSession(newSession);
   };
   const updateUser = (newUser: User) => {
      setUser(newUser);
   };
   return (
      <PageContext.Provider
         value={{
            prevUrl,
            updatePrevUrl,
            user,
            updateUser,
            session,
            updateSession,
         }}
      >
         {children}
      </PageContext.Provider>
   );
};
