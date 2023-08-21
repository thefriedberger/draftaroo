import Tabs from '@/components/tabs';
import { Tab, TabProps } from '@/lib/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import RulesTab from './tabs/rules';
import ScoringTab from './tabs/scoring';

const CreateLeague = async () => {
   const supabase = createServerComponentClient<Database>({ cookies });
   const {
      data: { session },
   } = await supabase.auth.getSession();

   const {
      data: { user },
   } = await supabase.auth.getUser();

   const { data } = await supabase
      .from('profiles')
      .select('*')
      .match({ id: user?.id });

   const currentUser = data?.[0];

   const createLeague = async (formData: FormData) => {
      'use server';

      const leagueName = String(formData.get('league-name'));
      const rules: Database['public']['Tables']['leagues']['Row']['league_rules'] =
         [
            {
               number_of_teams: String(formData.get('number_of_teams')) || '1',
               keepers_enabled:
                  Boolean(formData.get('keepers_enabled')) || false,
            },
         ];
      const scoring: Database['public']['Tables']['leagues']['Row']['league_scoring'] =
         [
            {
               goals: Number(formData.get('goals')) | 2,
               assists: Number(formData.get('assists')) | 1.5,
               plus_minus: Number(formData.get('plus_minus')) | 0.5,
               powerplay_goals: Number(formData.get('ppg')) | 1.5,
               powerplay_assists: Number(formData.get('ppa')) | 1,
               shorthanded_goals: Number(formData.get('shg')) | 3,
               shorthanded_assists: Number(formData.get('sha')) | 2.5,
               shots: Number(formData.get('shots')) | 0.25,
               hits: Number(formData.get('hits')) | 0.5,
               blocks: Number(formData.get('blocks')) | 0.75,
            },
         ];

      const generateLeagueId = async () => {
         const supabase = createServerComponentClient<Database>({ cookies });
         const { data } = await supabase.from('leagues').select('league_id');
         let leagueId;
         if (data?.length === 0) {
            return Math.random().toString(30).slice(2);
         }
         data?.forEach((league) => {
            leagueId = Math.random().toString(30).slice(2);
            do {
               leagueId = Math.random().toString(30).slice(2);
            } while (league.league_id === leagueId);
         });
         return leagueId;
      };

      const leagueId = await generateLeagueId();

      if (user) {
         const owner = user.id;
         const response = await fetch(
            `http://localhost:3000/leagues/create-league`,
            {
               method: 'put',
               body: JSON.stringify({
                  leagueId,
                  owner,
                  leagueName,
                  rules,
                  scoring,
               }),
            }
         );
         const { error, data } = await response.json();
         if (error) return;
         redirect(`/leagues/${data?.[0].league_id}`);
      }
   };

   const tabs: Tab[] = [
      {
         tabButton: 'League Rules',
         tabPane: <RulesTab />,
      },
      {
         tabButton: 'Scoring',
         tabPane: <ScoringTab />,
      },
   ];
   const tabProps: TabProps = {
      tabs,
      className: 'flex flex-col w-full lg:max-w-screen-xl text-white',
   };

   return (
      <>
         {session && (
            <>
               <h1 className="my-2 text-3xl text-white">
                  Welcome, {currentUser?.first_name && currentUser.first_name}
               </h1>
               <p>Ready to create a league? Fill out the thing below</p>
               <form
                  action={createLeague}
                  className="flex flex-col w-full lg:w-full max-w-full lg:max-w-2xl p-4"
               >
                  <label htmlFor="league-name" className="text-white">
                     League Name
                  </label>
                  <input
                     type="text"
                     name="league-name"
                     id="league-name"
                     className="mb-3 p-1 text-black"
                     required
                  />

                  <Tabs {...tabProps} />
                  <button
                     type="submit"
                     className="bg-white rounded-md mx-auto max-w-min-content p-2"
                  >
                     Submit
                  </button>
               </form>
            </>
         )}
         {!session && (
            <h1 className="text-3xl lg:max-w-lg text-white">
               Please login to make changes
            </h1>
         )}
      </>
   );
};

export default CreateLeague;
