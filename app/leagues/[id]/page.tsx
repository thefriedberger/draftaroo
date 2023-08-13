'use client';
import addTeam from '@/utils/add-team';
import {
   User,
   createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

const League = ({ params }: { params: { id: string } }) => {
   const supabase = createClientComponentClient<Database>();

   const [user, setUser] = useState<User>();
   const [league, setLeague] = useState<League>();
   const [owner, setOwner] = useState<string>();
   const [team, setTeam] = useState<Team>();
   const [hasTeam, setHasTeam] = useState<Boolean>();

   const getUser = async () => {
      const {
         data: { user },
      } = await supabase.auth.getUser();
      if (user) setUser(user);
   };

   const getLeague = async () => {
      const { data } = await supabase
         .from('leagues')
         .select('*')
         .match({ league_id: params.id });
      setLeague(data?.[0]);
      setOwner(data?.[0]?.owner);
   };
   const getTeam = async () => {
      const team = await supabase
         .from('teams')
         .select('*')
         .match({ owner: user?.id, league_id: league?.league_id });
      setTeam(team?.data?.[0]);
   };

   useEffect(() => {
      getUser();
      getLeague();
   }, []);

   useEffect(() => {
      if (user) getTeam();
   }, [user, league]);
   useEffect(() => {
      setHasTeam(team ? true : false);
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

   return (
      <>
         {hasTeam ? (
            <>
               <p>You have a team!</p>
            </>
         ) : (
            <div className="">
               <h1>Looks like you need to create a team</h1>
               <p>Let&apos;s get started!</p>
               <form action={addTeam} className="flex flex-col">
                  <input hidden defaultValue={params.id} name="league_id" />
                  <label htmlFor="team-name">Team name</label>
                  <input required name="team_name" id="team-name" />
                  <button type="submit">Submit</button>
               </form>
            </div>
         )}
         {/* <OwnerView />
         <TeamView /> */}
      </>
   );
};

export default League;
