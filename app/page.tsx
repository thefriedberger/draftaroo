'use client';

import Callout from '@/components/ui/callout';
import { PageContext } from '@/components/ui/context/page-context';
import { useContext } from 'react';

export default function Home() {
   // const supabase = createServerComponentClient<Database>({cookies});
   const { user, userTeams, leagues, drafts } = useContext(PageContext);
   return (
      <div className="pt-5 dark:text-white text-center">
         <h1 className="text-3xl">Welcome to Draftaroo!</h1>
         <div className="flex flex-col items-stretch">
            {user &&
               leagues
                  ?.filter((league: League) => {
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
                                 href: `/leagues/${league.league_id}`,
                                 text: 'View league',
                              },
                           ],
                        }}
                     />;
                  })}
            {userTeams &&
               leagues &&
               userTeams?.map((team: Team, index: number) => {
                  leagues?.filter(
                     (league: League) =>
                        league.league_id && league.league_id === team.league_id
                  );
                  const league: League = leagues.filter(
                     (league: League) => league.league_id === team.league_id
                  )[0];
                  const leagueDrafts = drafts.filter(
                     (draft: Draft) => draft.league_id === team.league_id
                  );
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
                        href: `/leagues/${team.league_id}`,
                        text: 'View league',
                     },
                     ...draftLinks,
                  ];
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
