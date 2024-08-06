'use client';
import { PageContext } from '@/components/ui/context/page-context';
import inviteUser from '@/utils/invite-user';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

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

export type UserInvite = {
   email: string;
   callback: string;
   teamId: string;
   leagueID: string;
};

const TeamAdmin = ({
   team,
   setShouldFetchTeams,
}: {
   team: Team;
   setShouldFetchTeams: (value: boolean) => void;
}) => {
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
         setShouldFetchTeams(true);
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
            setShouldFetchTeams(true);
            router.refresh();
         }
      }
   };
   return (
      <div className={classNames('flex my-2')}>
         <p className="mr-3 min-w-[80px]">{team_name}</p>
         {owner && <p>{ownerEmail}</p>}
         <div className="flex flex-row items-stretch mr-2">
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
         <div className="flex flex-row items-stretch">
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
               Add owner
            </button>
         </div>
      </div>
   );
};
