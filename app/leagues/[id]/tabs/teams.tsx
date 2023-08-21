'use client';
import { PageContext } from '@/components/context/page-context';
import Team from '@/components/team';
import inviteUser from '@/utils/invite-user';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useContext, useState } from 'react';

export type EmailInvite = {
   email: string;
   callback: string;
   leagueId: string;
};

const TeamsTab = ({ league }: { league: League }) => {
   const [newUserEmail, setNewUserEmail] = useState<string>('');

   const { leagues, teams, user, session } = useContext(PageContext);
   const [numTeams, setNumTeams] = useState<number>(0);
   const [hasMaxTeams, setHasMaxTeams] = useState<boolean>(
      numTeams <= leagues?.league_rules?.['number_of_teams']
   );
   const router = useRouter();

   const updateEmail = (e: ChangeEvent<HTMLInputElement>) => {
      setNewUserEmail(e.target.value);
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData: EmailInvite = {
         email: newUserEmail,
         callback: String(
            `${location.origin}/leagues/${league.league_id}/callback`
         ),
         leagueId: league.league_id || '',
      };
      const { user, error } = await inviteUser(formData);
      if (!error) {
         router.refresh();
         console.log(user, error);
      }
   };
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
                           return <Team key={team.id} {...team} />;
                        })}
                  </>
               )}
               {!hasMaxTeams && (
                  <form onSubmit={handleSubmit}>
                     <input
                        hidden
                        defaultValue={`${location.origin}/auth/callback`}
                        name="callback"
                     />
                     <input
                        hidden
                        defaultValue={
                           league && league !== undefined
                              ? league.league_id
                              : ''
                        }
                        name="league-id"
                     />
                     <div className="flex">
                        <label htmlFor="new-team">Owner&apos;s email</label>
                        <input
                           id="new-team"
                           name="new-team"
                           className="mr-3"
                           type="email"
                           value={newUserEmail}
                           onChange={updateEmail}
                        />
                        <button
                           type="submit"
                           className="bg-white text-black rounded-sm"
                        >
                           Invite owner
                        </button>
                     </div>
                  </form>
               )}
            </>
         )}
      </>
   );
};

export default TeamsTab;
