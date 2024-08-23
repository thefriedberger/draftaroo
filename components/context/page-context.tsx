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
   userTeams?: Team[] | any;
   updateTeam?: (newTeam: Team | any) => void;
   teams?: Team | any;
   updateTeams?: (newTeams: Team | any) => void;
   leagues?: League | any;
   updateLeagues?: (newLeagues: League | any) => void;
   profile?: Profile | any;
   udpateProfile?: (newProfile: Profile | any) => void;
   userSignout?: () => void;
   fetchLeagues?: () => void;
   watchlist?: Watchlist | any;
   fetchWatchlist?: () => void;
   updateWatchlist?: (player: Player, action: WatchlistAction) => void;
};

const initialValues = {};

interface Props {
   children: React.ReactNode;
}
export enum WatchlistAction {
   ADD = 'add',
   UPDATE = 'update',
   DELETE = 'delete',
}
export const PageContext = React.createContext<PageContextType>(initialValues);

export const PageContextProvider: React.FC<Props> = ({ children }) => {
   const [session, setSession] = React.useState<Session | any>();
   const [user, setUser] = React.useState<User | any>();
   const [userTeams, setUserTeams] = React.useState<Team | any>();
   const [teams, setTeams] = React.useState<Team | any>();
   const [leagues, setLeagues] = React.useState<League | any>();
   const [profile, setProfile] = React.useState<Profile | any>();
   const [watchlist, setWatchlist] = React.useState<number[]>([]);
   const [shouldUpdateWatchlist, setShouldUpdateWatchlist] =
      React.useState<boolean>(false);
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
      setUserTeams(newTeam);
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
   const updateWatchlist = async (
      player: Player,
      action: WatchlistAction,
      draft: Draft
   ) => {
      const supabase = createClientComponentClient<Database>();
      if (watchlist) {
         if (action === WatchlistAction.DELETE) {
            setWatchlist(watchlist?.filter((el) => el !== player.id));
         }
         if (action === WatchlistAction.ADD) {
            setWatchlist((prev) => [...prev, player.id]);
         }
      }
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
      const { data } = await supabase
         .from('watchlist')
         .select('*')
         .match({ owner: user?.id });
      if (!data?.length) {
         const { data } = await supabase
            .from('watchlist')
            .insert({ owner: user?.id, players: [] })
            .select('*');
         if (data?.[0]?.players) {
            setShouldUpdateWatchlist(false);
            setWatchlist(data?.[0]?.players);
         }
      }
      if (data) {
         if (data?.[0]?.players) {
            setShouldUpdateWatchlist(false);
            setWatchlist(data?.[0]?.players);
         }
      }
   };

   const userSignout = () => {
      setSession(null);
      setUser(null);
      setUserTeams(null);
      setTeams(null);
      setLeagues(null);
      setProfile(null);
      setWatchlist([]);
      router.refresh();
   };
   useEffect(() => {
      if (user?.id && user !== undefined && shouldFetchProfile) fetchProfile();
   }, [user]);

   useEffect(() => {
      if (user?.id && user !== undefined && teams) fetchLeagues();
      if (user?.id && user !== undefined && watchlist) fetchWatchlist();
   }, [userTeams, teams]);

   useEffect(() => {
      const addWatchlist = async () => {
         const supabase = createClientComponentClient<Database>();
         let playerIDs: number[] = [];
         for (const playerID of watchlist) {
            playerIDs.push(playerID);
         }

         const { data, error } = await supabase
            .from('watchlist')
            .update({ players: playerIDs })
            .match({ owner: user?.id })
            .select('*');
         if (data) {
            if (data?.[0]?.players) {
               setShouldUpdateWatchlist(false);
               setWatchlist(data?.[0]?.players);
            }
         }
      };
      shouldUpdateWatchlist && addWatchlist();
   }, [watchlist]);

   return (
      <PageContext.Provider
         value={{
            user,
            updateUser,
            session,
            updateSession,
            userTeams,
            updateTeam,
            teams,
            updateTeams,
            leagues,
            updateLeagues,
            profile,
            udpateProfile,
            userSignout,
            fetchLeagues,
            watchlist,
            fetchWatchlist,
            // updateWatchlist,
         }}
      >
         {children}
      </PageContext.Provider>
   );
};
