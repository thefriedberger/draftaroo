'use client';
import inviteUser from '@/app/utils/invite-user';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

export type UserInvite = {
   email: string;
   callback: string;
   teamId: string;
   leagueID: string;
};
const TeamAdmin = ({ team }: { team: Team }) => {
   const supabase = createClientComponentClient<Database>();
   const { team_name, id, league_id, owner } = team;
   const [ownerEmail, setOwnerEmail] = useState<string>('');
   const [newUserEmail, setNewUserEmail] = useState<string>('');
   const [newTeamName, setNewTeamName] = useState<string>('');
   const router = useRouter();

   const updateEmail = (e: ChangeEvent<HTMLInputElement>) => {
      setNewUserEmail(e.target.value);
   };

   useEffect(() => {
      getUserByOwnerId();
   }, [owner]);

   const updateTeamName = (e: ChangeEvent<HTMLInputElement>) => {
      setNewTeamName(e.target.value);
   };

   const getUserByOwnerId = async () => {
      if (owner && owner !== undefined && owner.length > 0) {
         const { data } = await supabase
            .from('profiles')
            .select('*')
            .match({ id: owner });

         data && data?.[0]?.email && setOwnerEmail(data[0].email);
      }
   };
   const handleChangeName = async () => {
      const { error } = await supabase
         .from('teams')
         .update({ team_name: newTeamName })
         .match({ id: id });
      if (!error) {
         router.refresh();
      }
   };
   const handleChangeOwner = async () => {
      if (league_id && id) {
         const formData: UserInvite = {
            email: newUserEmail,
            callback: String(
               `${location.origin}/leagues/${league_id}/callback`
            ),
            teamId: id,
            leagueID: league_id,
         };
         const response = await inviteUser(formData);
         if (response) {
            console.log(response);
         } else {
            router.refresh();
         }
      }
   };
   return (
      <div className={classNames('flex flex-col my-5')}>
         <div className="grid grid-cols-3 my-2">
            <p className="mr-3 min-w-[80px]">{team_name}</p>
            <input
               className="p-2"
               type="text"
               name="team_name"
               onChange={updateTeamName}
            />
            <button
               className="p-2 ml-2 bg-white rounded-md text-black"
               type="button"
               onClick={handleChangeName}
            >
               Update name
            </button>
         </div>
         <div className="grid grid-cols-3">
            {owner && <p>{ownerEmail}</p>}
            <input
               className="p-2"
               type="email"
               name="user_email"
               onChange={updateEmail}
            />
            <button
               className="p-2 ml-2 bg-white rounded-md text-black"
               type="button"
               onClick={handleChangeOwner}
            >
               Add/Change owner
            </button>
         </div>
      </div>
   );
};

export default TeamAdmin;
