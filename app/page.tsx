'use client';

import Callout from '@/components/callout';
import { PageContext } from '@/components/context/page-context';
import { useContext, useEffect } from 'react';

export default function Home() {
   const { team, leagues } = useContext(PageContext);
   useEffect(() => {
      console.log(team);
   }, [team]);
   return (
      <div className="pt-5 text-white text-center">
         <h1 className="text-3xl">Welcome to Draftaroo!</h1>
         <div className="grid grid-flow-row">
            <Callout
               {...{
                  calloutText: 'Want to create a new league?',
                  link: {
                     href: '/leagues/create',
                     text: 'Create league',
                  },
               }}
            />
            {team &&
               team?.map((team: Team, index: number) => {
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
                           link: {
                              href: `/leagues/${team.league_id}`,
                              text: 'View league',
                           },
                        }}
                     />
                  );
               })}
         </div>
      </div>
   );
}
