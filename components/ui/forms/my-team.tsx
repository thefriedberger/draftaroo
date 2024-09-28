'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChangeEvent, useEffect, useState } from 'react';

const MyTeamForm = ({ team }: { team: Team }) => {
   const [newTeamName, setNewTeamName] = useState<string>('');
   const [isValid, setIsValid] = useState<boolean>(false);
   const supabase = createClientComponentClient<Database>();

   const updateTeamName = (e: ChangeEvent<HTMLInputElement>) => {
      setNewTeamName(e.target.value);
   };

   useEffect(() => {
      if (newTeamName.trim().length > 0) {
         setIsValid(true);
      } else {
         setIsValid(false);
      }
   }, [newTeamName]);

   const handleChangeName = async () => {
      if (team && newTeamName.trim().length > 0) {
         const { error } = await supabase
            .from('teams')
            .update({ team_name: newTeamName.trim() })
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
            min={1}
            onChange={updateTeamName}
         />
         <button
            className="p-2 bg-white rounded-md text-black disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={!isValid}
            onClick={handleChangeName}
         >
            Update
         </button>
      </form>
   );
};

export default MyTeamForm;
