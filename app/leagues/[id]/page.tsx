'use server';
import addTeam from '@/app/utils/add-team';
import {
   fetchDraftByLeague,
   fetchLeague,
   fetchTeam,
} from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/server';
import Tabs from '@/components/ui/tabs';
import {
   KeeperViewProps,
   LeagueTeamViewProps,
   Tab,
   TabProps,
} from '@/lib/types';
import { UserResponse } from '@supabase/supabase-js';
import KeepersTab from '../tabs/keepers';
import TeamView from './team-view';

const League = async ({ params: { id } }: { params: { id: string } }) => {
   const supabase = createClient();

   const currentYear = new Date().getFullYear();
   const { data: user }: Awaited<UserResponse> = await supabase.auth.getUser();
   const { data: session } = await supabase.auth.getSession();
   if (!user?.user || !session) {
      return;
   }
   const league: Awaited<League> = await fetchLeague(supabase, id);
   const owner: boolean = league?.owner === user?.user?.id;
   const draft: Awaited<Draft> = await fetchDraftByLeague(
      supabase,
      id,
      currentYear
   );
   const team: Awaited<Team> = await fetchTeam(supabase, user.user.id, id);

   const leagueTeamViewProps: LeagueTeamViewProps = {
      team: team,
      leagueID: id,
   };

   const keepersProps: KeeperViewProps = {
      league: league,
      team: team,
      draft: draft,
   };

   const tabs: Tab[] = [
      {
         tabButton: 'Your Team',
         tabPane: <TeamView {...leagueTeamViewProps} />,
      },
      {
         tabButton: 'Set Keepers',
         tabPane: <KeepersTab {...keepersProps} />,
      },
   ];

   const tabProps: TabProps = {
      tabs,
      className:
         'flex flex-col w-full lg:max-w-screen-xl text-white mt-5 items-center',
   };

   return (
      <>
         {
            <>
               {team && <Tabs {...tabProps} />}
               {!team && (
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
               )}
            </>
         }
      </>
   );
};
export default League;
