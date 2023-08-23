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
   teamName: string;
};

const TeamsTab = ({ league }: { league: League }) => {
   const [newUserEmail, setNewUserEmail] = useState<string>('');
   const [newTeamName, setNewTeamName] = useState<string>('');

   const { leagues, teams, user, session, fetchTeams } =
      useContext(PageContext);
   const [numTeams, setNumTeams] = useState<number>(0);
   const [hasMaxTeams, setHasMaxTeams] = useState<boolean>(
      numTeams <= leagues?.league_rules?.['number_of_teams']
   );
   const router = useRouter();

   const updateEmail = (e: ChangeEvent<HTMLInputElement>) => {
      setNewUserEmail(e.target.value);
   };

   const updateTeamName = (e: ChangeEvent<HTMLInputElement>) => {
      setNewTeamName(e.target.value);
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData: EmailInvite = {
         email: newUserEmail,
         callback: String(
            `${location.origin}/leagues/${league.league_id}/callback`
         ),
         leagueId: league.league_id || '',
         teamName: newTeamName,
      };
      const { user, error } = await inviteUser(formData);
      if (!error || error === undefined) {
         fetchTeams?.();
         router.refresh();
         setNewTeamName('');
         setNewUserEmail('');
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
                  <>
                     <form
                        className="bg-gray-primary p-2 rounded-md my-2"
                        onSubmit={handleSubmit}
                     >
                        <p className="font-bold mb-2 text-lg">Add new team</p>
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
                        <div className="flex flex-col">
                           <div className="flex flex-row justify-between mb-2">
                              <label htmlFor="team_name">Team name</label>
                              <input
                                 type="text"
                                 value={newTeamName}
                                 id="team_name"
                                 name="team_name"
                                 className="ml-3"
                                 onChange={updateTeamName}
                              />
                           </div>
                           <div className="flex flex-row justify-between mb-2">
                              <label htmlFor="new_team">
                                 Owner&apos;s email
                              </label>
                              <input
                                 id="new_team"
                                 name="new_team"
                                 className="ml-3"
                                 type="email"
                                 value={newUserEmail}
                                 onChange={updateEmail}
                              />
                           </div>
                           <button
                              type="submit"
                              className="bg-white text-black rounded-sm"
                           >
                              Invite owner
                           </button>
                        </div>
                     </form>
                  </>
               )}
            </>
         )}
      </>
   );
};

export default TeamsTab;
