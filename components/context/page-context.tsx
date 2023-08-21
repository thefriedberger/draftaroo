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
   teams?: Team | any;
   updateTeams?: (newTeams: Team | any) => void;
   leagues?: League | any;
   updateLeagues?: (newLeagues: League | any) => void;
   profile?: Profile | any;
   udpateProfile?: (newProfile: Profile | any) => void;
   userSignout?: () => void;
};

const initialValues = {};

interface Props {
   children: React.ReactNode;
}

export const PageContext = React.createContext<PageContextType>(initialValues);

export const PageContextProvider: React.FC<Props> = ({ children }) => {
   const [session, setSession] = React.useState<Session | any>();
   const [user, setUser] = React.useState<User | any>();
   const [teams, setTeams] = React.useState<Team | any>();
   const [leagues, setLeagues] = React.useState<League | any>();
   const [profile, setProfile] = React.useState<Profile | any>();

   const router = useRouter();

   const updateSession = (newSession: Session) => {
      setSession(newSession);
      router.refresh();
   };
   const updateUser = (newUser: User) => {
      setUser(newUser);
      router.refresh();
   };
   const updateTeams = (newTeams: Team) => {
      setTeams(newTeams);
   };
   const updateLeagues = (newLeagues: League) => {
      setLeagues(newLeagues);
   };
   const udpateProfile = (newProfile: Profile) => {
      setProfile(newProfile);
   };

   const fetchTeams = async () => {
      const supabase = createClientComponentClient<Database>();
      const { data } = await supabase
         .from('teams')
         .select('*')
         .match({ owner: user?.id });
      if (data) setTeams(data as Team);
   };

   const fetchProfile = async () => {
      const supabase = createClientComponentClient<Database>();
      const { data } = await supabase
         .from('profiles')
         .select('*')
         .match({ id: user?.id });
      if (data) setProfile(data);
   };

   const fetchLeagues = async () => {
      const supabase = createClientComponentClient<Database>();
      const { data } = await supabase.from('leagues').select('*');
      if (data) {
         teams?.forEach((team: Team) => {
            if (team.league_id === data?.[0].league_id)
               setLeagues(data as League);
         });
      }
   };

   const userSignout = () => {
      setSession(null);
      setUser(null);
      setTeams(null);
      setLeagues(null);
      setProfile(null);
      router.refresh();
   };
   useEffect(() => {
      if (user?.id && user !== undefined) fetchTeams();
      if (user?.id && user !== undefined) fetchProfile();
   }, [user]);

   useEffect(() => {
      if (user?.id && user !== undefined && teams) fetchLeagues();
   }, [teams]);

   return (
      <PageContext.Provider
         value={{
            user,
            updateUser,
            session,
            updateSession,
            teams,
            updateTeams,
            leagues,
            updateLeagues,
            profile,
            udpateProfile,
            userSignout,
         }}
      >
         {children}
      </PageContext.Provider>
   );
};
