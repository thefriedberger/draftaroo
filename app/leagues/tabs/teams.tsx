'use client';
import { PageContext } from '@/components/context/page-context';
import TeamAdmin from '@/components/team/admin';
import { useContext, useEffect, useState } from 'react';

const TeamsTab = ({ league }: { league: League }) => {
   const [shouldFetchTeams, setShouldFetchTeams] = useState<boolean>(false);

   const { leagues, teams, user, session, fetchTeams } =
      useContext(PageContext);

   useEffect(() => {
      shouldFetchTeams && fetchTeams?.();
      setShouldFetchTeams(false);
   }, [shouldFetchTeams]);
   return (
      <>
         {user && user !== undefined && (
            <>
               {teams && (
                  <>
                     <div className="grid grid-cols-2">
                        <p className="font-bold text-xl mr-3">Team name</p>
                        <p className="font-bold text-xl">Owner</p>
                     </div>
                     {teams
                        .filter((team: Team) => {
                           if (league && league !== undefined)
                              return team.league_id === league.league_id;
                        })
                        .map((team: Team) => {
                           return (
                              <TeamAdmin
                                 key={team.id}
                                 team={team}
                                 setShouldFetchTeams={setShouldFetchTeams}
                              />
                           );
                        })}
                  </>
               )}
            </>
         )}
      </>
   );
};

export default TeamsTab;
