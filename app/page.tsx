'use server';

import Callout from '@/components/ui/callout';
import { buttonClasses } from '@/components/ui/helpers/buttons';
import AuthModal from '@/components/ui/modals/auth';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserResponse } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { fetchAllUserTeams, fetchDrafts, fetchLeagues } from './utils/helpers';

export default async function Home() {
   const supabase = createServerComponentClient<Database>({ cookies });
   const { data: user }: Awaited<UserResponse> = await supabase.auth.getUser();
   if (!user?.user) {
      return (
         <>
            <h1 className={'dark:text-white'}>You must log in to see this</h1>
            <AuthModal buttonClass={buttonClasses} />
         </>
      );
   }
   const leagues: Awaited<League[]> = await fetchLeagues(supabase);
   if (!leagues) {
      return <></>;
   }
   const userTeams: Awaited<Team[]> = await fetchAllUserTeams(
      supabase,
      user.user.id
   );
   return (
      <div className="pt-5 dark:text-white text-center">
         <h1 className="text-3xl">Welcome to Draftaroo!</h1>
         <div className="flex flex-col items-stretch">
            <>
               {leagues
                  .filter((league: League) => {
                     userTeams.filter((team: Team) => {
                        return (
                           team.league_id === league.league_id &&
                           team.owner === null
                        );
                     });
                  })
                  .map((league: League, index: number) => {
                     <Callout
                        key={index}
                        {...{
                           calloutText: `${league.league_name}`,
                           links: [
                              {
                                 href: `/leagues/${league.league_id}/keepers`,
                                 text: 'Set Keepers',
                              },
                           ],
                        }}
                     />;
                  })}
            </>
            {userTeams &&
               leagues &&
               userTeams?.map(async (team: Team, index: number) => {
                  leagues?.filter(
                     (league: League) =>
                        league.league_id && league.league_id === team.league_id
                  );
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
                           league.owner === user.user.id &&
                           league.league_id === team.league_id
                     )
                     .map((league) => {
                        return {
                           href: `/leagues/${league.league_id}/league-management`,
                           text: 'Manage league',
                        };
                     });
                  const draftLinks = leagueDrafts.map((draft: Draft) => {
                     const draftLink = draft.is_completed
                        ? {
                             href: `/leagues/${team.league_id}/draft-results/${draft.id}`,
                             text: 'View draft results',
                          }
                        : {
                             href: `/leagues/${team.league_id}/draft/${draft.id}`,
                             text: 'View draft',
                          };
                     return draftLink;
                  });
                  const leagueLinks = [
                     {
                        href: `/leagues/${league.league_id}/keepers`,
                        text: 'Set Keepers',
                     },
                  ];
                  if (leagueManagementLink) {
                     leagueLinks.push(...leagueManagementLink);
                  }
                  if (draftLinks) {
                     leagueLinks.push(...draftLinks);
                  }
                  return (
                     <Callout
                        key={index}
                        {...{
                           calloutText: `${team.team_name} - ${league?.league_name}`,
                           links: leagueLinks,
                        }}
                     />
                  );
               })}
         </div>
      </div>
   );
}
