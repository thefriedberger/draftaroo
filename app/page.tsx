'use client';

import Callout from '@/components/callout';
import { PageContext } from '@/components/context/page-context';
import { useContext } from 'react';

export default function Home() {
   const { user, userTeams, leagues } = useContext(PageContext);
   return (
      <div className="pt-5 text-white text-center">
         <h1 className="text-3xl">Welcome to Draftaroo!</h1>
         <div className="grid grid-flow-row">
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
                  console.log(league);
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
               userTeams?.map((team: Team, index: number) => {
                  leagues?.filter((league: League) => {
                     {
                        if (league.league_id)
                           return league.league_id === team.league_id;
                     }
                  });

                  return (
                     <Callout
                        key={index}
                        {...{
                           calloutText: `${team.team_name} - ${leagues?.[0]?.league_name}`,
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
            {/* {team?.length === 0 &&
               leagues?.filter((league: League) => {
                  {
                     if (league.owner === user?.id) {
                        return (
                           <div className="">
                              <h1>Looks like you need to create a team</h1>
                              <p>Let&apos;s get started!</p>
                              <form
                                 action={(formData: FormData) =>
                                    addTeam(formData, league.league_id)
                                 }
                                 className="flex flex-col"
                              >
                                 <input
                                    hidden
                                    defaultValue={league.league_id}
                                    name="league_id"
                                 />
                                 <label htmlFor="team-name">Team name</label>
                                 <input
                                    required
                                    name="team_name"
                                    id="team-name"
                                 />
                                 <button type="submit">Submit</button>
                              </form>
                           </div>
                        );
                     }
                  }
               })} */}
         </div>
      </div>
   );
}
