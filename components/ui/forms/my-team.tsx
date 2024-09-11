'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChangeEvent, useState } from 'react';

const MyTeamForm = ({ team }: { team: Team }) => {
   const [newTeamName, setNewTeamName] = useState<string>('');
   const supabase = createClientComponentClient<Database>();
   const updateTeamName = (e: ChangeEvent<HTMLInputElement>) => {
      setNewTeamName(e.target.value);
   };

   const handleChangeName = async () => {
      if (team) {
         const { error } = await supabase
            .from('teams')
            .update({ team_name: newTeamName })
            .match({ id: team.id });
         console.log(error);
      }
   };
   return (
      <form className="flex flex-col items-start">
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
            type="submit"
            onClick={handleChangeName}
         >
            Update
         </button>
      </form>
   );
};

export default MyTeamForm;
