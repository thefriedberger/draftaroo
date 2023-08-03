'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function RealtimeTeams({ teamsList }: { teamsList: Team[] }) {
   const [teams, setTeams] = useState(teamsList);
   const supabase = createClientComponentClient<Database>();

   useEffect(() => {
      setTeams(teamsList);
   }, [teamsList]);

   useEffect(() => {
      const channel = supabase
         .channel('any')
         .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'teams' },
            (payload) => {
               switch (payload.eventType) {
                  case 'UPDATE':
                     const updatedTeams = teams.map((team) =>
                        team.id === payload.new.id
                           ? (payload.new as Team)
                           : team
                     );
                     setTeams(updatedTeams);
                     break;
                  case 'INSERT':
                     setTeams((teams) => [...teams, payload.new as Team]);
                     break;
                  case 'DELETE':
                     const removedTeams = teams.filter((team) => {
                        return team.id !== payload.old.id;
                     });
                     setTeams(removedTeams);
                     break;
                  default:
                     break;
               }
            }
         )
         .subscribe();

      return () => {
         supabase.removeChannel(channel);
      };
   }, [supabase, setTeams, teams]);

   return (
      <>
         {teams.map((team) => (
            <div key={team.id} className="text-white">
               {team.team_name}
            </div>
         ))}
      </>
   );
}
