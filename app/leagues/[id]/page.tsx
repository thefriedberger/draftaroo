'use client';
import { PageContext } from '@/components/context/page-context';
import AuthModal from '@/components/modals/auth';
import Tabs from '@/components/tabs';
import { Tab, TabProps } from '@/lib/types';
import addTeam from '@/utils/add-team';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useContext, useEffect, useState } from 'react';
import OwnerView from './owner-view';
import TeamView from './team-view';

const League = ({ params: { id } }: { params: { id: string } }) => {
   const supabase = createClientComponentClient<Database>();
   const [isLoading, setIsLoading] = useState<Boolean>(true);
   const [league, setLeague] = useState<League>();
   const [owner, setOwner] = useState<string>();
   const [team, setTeam] = useState<Team>();
   const [hasTeam, setHasTeam] = useState<Boolean>();

   const { session, user, teams, leagues } = useContext(PageContext);

   useEffect(() => {
      leagues?.forEach((league: League) => {
         if (league.league_id === id) {
            setLeague(league);
         }
      });
   }, [leagues]);

   useEffect(() => {
      teams?.forEach((team: Team) => {
         if (user && team.owner === user?.id) {
            setTeam(team);
            setOwner(user.id);
         }
      });
   }, [teams]);

   useEffect(() => {
      setHasTeam(team ? true : false);
      return () => {
         setIsLoading(false);
      };
   }, [team]);

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
                  setHasTeam(true);
               }
            }
         )
         .subscribe();
      if (hasTeam) supabase.removeChannel(channel);
   }, [team, user]);

   const tabs: Tab[] = [
      {
         tabButton: 'Your Team',
         tabPane: <TeamView {...team} />,
      },
      {
         tabButton: 'League Management',
         tabPane: <OwnerView league={league} />,
      },
   ];
   const tabProps: TabProps = {
      tabs,
      className: 'flex flex-col w-full lg:max-w-screen-xl text-white mt-5',
   };

   useEffect(() => {
      console.log(user, session);
   }, [user, session]);
   return (
      <>
         {!session || session === undefined || !user || user === undefined ? (
            <>
               <h1>You must log in to see this</h1>
               <AuthModal buttonClass="py-2 px-4 rounded-md no-underline" />
            </>
         ) : (
            <>
               {owner === user?.id && (
                  <>
                     <Tabs {...tabProps} />
                  </>
               )}
               {user &&
                  (isLoading ? (
                     <p>Loading</p>
                  ) : !hasTeam ? (
                     <div className="">
                        <h1>Looks like you need to create a team</h1>
                        <p>Let&apos;s get started!</p>
                        <form
                           action={(formData: FormData) =>
                              addTeam(formData, id)
                           }
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
                           <TeamView {...team} />
                        </>
                     )
                  ))}
            </>
         )}
      </>
   );
};
export default League;
