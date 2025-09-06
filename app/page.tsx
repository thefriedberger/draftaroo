'use server';

import { createClient } from '@/app/utils/supabase/server';
import Callout from '@/components/ui/callout';
import { CalloutLink } from '@/lib/types';
import { User } from '@supabase/supabase-js';
import {
   fetchAllUserTeams,
   fetchDrafts,
   fetchLeagues,
   getUser,
} from './utils/helpers';
export default async function Home() {
   const supabase = createClient();

   const user: Awaited<User | null> = await getUser(supabase);

   if (!user) {
      return;
   }
   const leagues: Awaited<League[]> = await fetchLeagues(supabase);
   if (!leagues) {
      return <></>;
   }
   const userTeams: Awaited<Team[]> = await fetchAllUserTeams(
      supabase,
      user.id
   );

   return (
      <div className="pt-5 dark:text-white text-center w-full lg:max-w-screen-lg">
         <h1 className="text-3xl">Welcome to Draftaroo!</h1>
         <div className="flex flex-col lg:flex-row flex-wrap w-full items-stretch lg:items-start justify-between">
            {userTeams &&
               leagues &&
               userTeams?.map(async (team: Team, index: number) => {
                  const league: League = leagues.filter(
                     (league: League) => league.league_id === team.league_id
                  )[0];

                  if (!league?.league_id) {
                     return <></>;
                  }
                  const drafts: Awaited<Draft[]> = await fetchDrafts(
                     supabase,
                     league.league_id
                  );
                  const leagueDrafts = drafts.filter(
                     (draft: Draft) => draft.league_id === team.league_id
                  );
                  const leagueManagementLink = leagues
                     .filter(
                        (league) =>
                           league.owner === user.id &&
                           league.league_id === team.league_id
                     )
                     .map((league) => {
                        return {
                           href: `/leagues/${league.league_id}/league-management`,
                           text: 'Manage league',
                        };
                     });
                  const draftLinks = leagueDrafts
                     .filter(
                        (draft) =>
                           draft?.draft_year &&
                           parseInt(draft.draft_year) ===
                              new Date().getUTCFullYear()
                     )
                     .map((draft: Draft) =>
                        !draft.is_completed
                           ? {
                                href: `/leagues/${team.league_id}/draft/${draft.id}`,
                                text: 'View draft',
                             }
                           : { href: '', text: '' }
                     )
                     .filter((link) => link?.href && link?.text);
                  const leagueLinks: CalloutLink[] = [
                     {
                        href: `/leagues/${league.league_id}/keepers`,
                        text: 'Set keepers',
                     },
                     {
                        href: `/leagues/${league.league_id}/my-team`,
                        text: 'Change team name',
                     },
                  ];
                  if (leagueManagementLink) {
                     leagueLinks.push(...leagueManagementLink);
                  }
                  if (leagueDrafts.some((draft) => draft.is_completed)) {
                     leagueLinks.push({
                        href: `/leagues/${league.league_id}/draft-results`,
                        text: 'Draft history',
                     });
                  }
                  if (draftLinks) {
                     leagueLinks.push(...draftLinks);
                  }
                  return (
                     <div key={index} className="flex-[25%] mx-5">
                        <Callout
                           {...{
                              calloutText: `${team.team_name} - ${league?.league_name}`,
                              links: leagueLinks,
                              classes: 'mx-auto',
                           }}
                        />
                     </div>
                  );
               })}
         </div>
      </div>
   );
}
