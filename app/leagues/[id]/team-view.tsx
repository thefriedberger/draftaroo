import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChangeEvent, useState } from 'react';

const TeamView = ({ teams, id }: { teams: Team[]; id: string }) => {
   const [newTeamName, setNewTeamName] = useState<string>('');
   const [teamName, setTeamName] = useState<string>();
   const supabase = createClientComponentClient<Database>();
   const updateTeamName = (e: ChangeEvent<HTMLInputElement>) => {
      setNewTeamName(e.target.value);
   };

   const handleChangeName = async () => {
      const teamID = teams.filter((team: Team) => {
         return team.league_id === id;
      })[0].id;
      await supabase
         .from('teams')
         .update({ team_name: newTeamName })
         .match({ id: teamID });
      setTeamName(newTeamName);
   };
   return (
      <>
         {teams &&
            teams
               .filter((team: Team) => {
                  return team.league_id === id;
               })
               .map((team: Team) => {
                  return (
                     <h2
                        className="font-bold text-xl text-black dark:text-white mb-2"
                        key={team.id}
                     >
                        {teamName || team.team_name}
                     </h2>
                  );
               })}
         <div className="flex flex-col items-start">
            <label htmlFor="team_name" className="text-black dark:text-white">
               Change team name:
            </label>
            <input
               className="p-2 my-2"
               type="text"
               name="team_name"
               id="team_name"
               onChange={updateTeamName}
            />
            <button
               className="p-2 bg-white rounded-md text-black"
               type="button"
               onClick={handleChangeName}
            >
               Update
            </button>
         </div>
      </>
   );
};

export default TeamView;
