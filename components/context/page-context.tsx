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
   team?: Team | any;
   updateTeam?: (newTeam: Team | any) => void;
   teams?: Team | any;
   updateTeams?: (newTeams: Team | any) => void;
   leagues?: League | any;
   updateLeagues?: (newLeagues: League | any) => void;
   profile?: Profile | any;
   udpateProfile?: (newProfile: Profile | any) => void;
   userSignout?: () => void;
   fetchTeam?: () => void;
   fetchTeams?: () => void;
   fetchLeagues?: () => void;
   watchlist?: Watchlist | any;
   fetchWatchlist?: () => void;
   updateWatchlist?: (player: string | number) => void;
};

const initialValues = {};

interface Props {
   children: React.ReactNode;
}

export const PageContext = React.createContext<PageContextType>(initialValues);

export const PageContextProvider: React.FC<Props> = ({ children }) => {
   const [session, setSession] = React.useState<Session | any>();
   const [user, setUser] = React.useState<User | any>();
   const [team, setTeam] = React.useState<Team | any>();
   const [teams, setTeams] = React.useState<Team | any>();
   const [leagues, setLeagues] = React.useState<League | any>();
   const [profile, setProfile] = React.useState<Profile | any>();
   const [watchlist, setWatchlist] = React.useState<Watchlist | any>();
   const [shouldFetchTeams, setShouldFetchTeams] =
      React.useState<boolean>(true);
   const [shouldFetchProfile, setShouldFetchProfile] =
      React.useState<boolean>(true);

   const router = useRouter();

   const updateSession = (newSession: Session) => {
      setSession(newSession);
      router.refresh();
   };
   const updateUser = (newUser: User) => {
      setUser(newUser);
      router.refresh();
   };
   const updateTeam = (newTeam: Team) => {
      setTeam(newTeam);
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
   const updateWatchlist = async (player: string | number) => {
      const supabase = createClientComponentClient<Database>();
      let newWatchlist: number[] = watchlist?.players
         ? watchlist.players.filter((p: number | string) => p !== player)
         : [player];
      const { data, error } = await supabase
         .from('watchlist')
         .update({ players: newWatchlist })
         .match({ owner: user?.id });
      if (data) {
         setWatchlist(data?.[0]);
      }
   };

   const fetchTeam = async () => {
      const supabase = createClientComponentClient<Database>();
      const { data, error } = await supabase
         .from('teams')
         .select('*')
         .match({ owner: user?.id });
      if (data) setTeam(data as Team);
   };

   const fetchTeams = async () => {
      const supabase = createClientComponentClient<Database>();
      const { data, error } = await supabase.from('teams').select('*');
      if (data && data.length !== 0) {
         setTeams(data as Team);
         setTeam(data.filter((team) => team.owner === user.id));
      }
      if (error) setShouldFetchTeams(false);
   };

   const fetchProfile = async () => {
      const supabase = createClientComponentClient<Database>();
      const { data, error } = await supabase
         .from('profiles')
         .select('*')
         .match({ id: user?.id });
      if (data) setProfile(data);
      if (error) setShouldFetchProfile(false);
   };

   const fetchLeagues = async () => {
      const supabase = createClientComponentClient<Database>();
      const { data, error } = await supabase.from('leagues').select('*');
      if (data) {
         if (teams.length === 0 && data?.[0].owner === user.id) {
            setLeagues(data as League);
         }
         teams?.forEach((team: Team) => {
            if (team.league_id === data?.[0].league_id) {
               setLeagues(data as League);
            }
         });
      }
   };

   const fetchWatchlist = async () => {
      const supabase = createClientComponentClient<Database>();
      const { data, error } = await supabase
         .from('watchlist')
         .select('*')
         .match({ owner: user?.id });
      if (data) {
         setWatchlist(data?.[0]);
      }
      if (data?.length === 0) {
         const { data, error } = await supabase
            .from('watchlist')
            .insert({ owner: user?.id });
         if (data) {
            setWatchlist(data?.[0]);
         }
      }
   };

   const userSignout = () => {
      setSession(null);
      setUser(null);
      setTeam(null);
      setTeams(null);
      setLeagues(null);
      setProfile(null);
      setWatchlist(null);
      router.refresh();
   };
   useEffect(() => {
      if (user?.id && user !== undefined && shouldFetchTeams) fetchTeams();
      if (user?.id && user !== undefined && shouldFetchProfile) fetchProfile();
   }, [user]);

   useEffect(() => {
      if (user?.id && user !== undefined && teams) fetchLeagues();
      if (user?.id && user !== undefined && teams) fetchWatchlist();
   }, [team, teams]);

   return (
      <PageContext.Provider
         value={{
            user,
            updateUser,
            session,
            updateSession,
            team,
            updateTeam,
            teams,
            updateTeams,
            leagues,
            updateLeagues,
            profile,
            udpateProfile,
            userSignout,
            fetchTeam,
            fetchTeams,
            fetchLeagues,
            watchlist,
            fetchWatchlist,
            updateWatchlist,
         }}
      >
         {children}
      </PageContext.Provider>
   );
};
