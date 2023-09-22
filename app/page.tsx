'use client';

import Callout from '@/components/callout';
import { PageContext } from '@/components/context/page-context';
import { useContext } from 'react';

export default function Home() {
   const { user, userTeams, leagues } = useContext(PageContext);
   return (
      <div className="pt-5 text-white text-center">
         <h1 className="text-3xl">Welcome to Draftaroo!</h1>
         <div className="flex flex-col items-stretch">
            <Callout
               {...{
                  calloutText: 'Want to create a new league?',
                  links: [
                     {
                        href: '/leagues/create',
                        text: 'Create league',
                     },
                  ],
               }}
            />
            {leagues
               ?.filter((league: League) => {
                  userTeams.league_id !== league.league_id &&
                     league.owner === user?.id;
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
                  leagues?.filter((league: League) => {
                     {
                        if (league.league_id)
                           return league.league_id === team.league_id;
                     }
                  });

                  const league: League = leagues.filter((league: League) => {
                     return league.league_id === team.league_id;
                  })[0];

                  return (
                     <Callout
                        key={index}
                        {...{
                           calloutText: `${team.team_name} - ${league?.league_name}`,
                           links: [
                              {
                                 href: `/leagues/${team.league_id}`,
                                 text: 'View league',
                              },
                              {
                                 href: `/leagues/${team.league_id}/draft`,
                                 text: 'View draft',
                              },
                           ],
                        }}
                     />
                  );
               })}
         </div>
      </div>
   );
}
