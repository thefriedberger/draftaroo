'use client';
import { PageContext } from '@/components/context/page-context';
import AuthModal from '@/components/modals/auth';
import Tabs from '@/components/tabs';
import { Tab, TabProps } from '@/lib/types';
import addTeam from '@/utils/add-team';
import {
   User,
   createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import OwnerView from './owner-view';
import TeamView from './team-view';

const League = ({ params: { id } }: { params: { id: string } }) => {
   const supabase = createClientComponentClient<Database>();
   const [isLoading, setIsLoading] = useState<Boolean>(true);
   const [league, setLeague] = useState<League>();
   const [owner, setOwner] = useState<User>();
   const [hasTeam, setHasTeam] = useState<Boolean>(false);

   const { session, user, userTeams, teams, leagues, fetchTeams } =
      useContext(PageContext);

   useEffect(() => {
      leagues?.forEach((league: League) => {
         if (league.league_id === id) {
            setLeague(league);
            if (league.owner === user?.id) {
               setOwner(user);
            }
         }
      });
   }, [leagues]);

   useEffect(() => {
      setHasTeam(userTeams ? true : false);
      return () => {
         setIsLoading(false);
      };
   }, [userTeams]);

   useEffect(() => {
      const channel = supabase
         .channel('teams-channel')
         .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'teams' },
            (payload) => {
               if (
                  payload.eventType === 'INSERT' &&
                  payload.new.owner === user?.id
               ) {
                  fetchTeams?.();
                  setHasTeam(true);
               }
            }
         )
         .subscribe();
      if (hasTeam) supabase.removeChannel(channel);
   }, [userTeams, user]);

   const tabs: Tab[] = [
      {
         tabButton: 'Your Team',
         tabPane: <TeamView teams={userTeams} id={id} />,
      },
      {
         tabButton: 'League Management',
         tabPane: <OwnerView league={league} />,
      },
   ];
   const tabProps: TabProps = {
      tabs,
      className:
         'flex flex-col w-full lg:max-w-screen-xl text-white mt-5 items-center',
   };

   useEffect(() => {
      if (userTeams === undefined) fetchTeams?.();
   }, [session, user, userTeams]);

   return (
      <>
         {!session || session === undefined || !user || user === undefined ? (
            <>
               <h1>You must log in to see this</h1>
               <AuthModal buttonClass="py-2 px-4 rounded-md no-underline" />
            </>
         ) : (
            <>
               {owner?.id === user?.id && (
                  <>
                     <Tabs {...tabProps} />
                  </>
               )}
               {!hasTeam ? (
                  <div className="">
                     <h1>Looks like you need to create a team</h1>
                     <p>Let&apos;s get started!</p>
                     <form
                        action={(formData: FormData) => addTeam(formData, id)}
                        className="flex flex-col"
                     >
                        <input hidden defaultValue={id} name="league_id" />
                        <label htmlFor="team-name">Team name</label>
                        <input required name="team_name" id="team-name" />
                        <button type="submit">Submit</button>
                     </form>
                  </div>
               ) : (
                  !owner && (
                     <>
                        <TeamView {...userTeams} />
                        <Link
                           className={'bg-emerald-primary p-2 rounded-md mt-2'}
                           href={`/leagues/${id}/draft`}
                        >
                           Join Draft
                        </Link>
                     </>
                  )
               )}
            </>
         )}
      </>
   );
};
export default League;
