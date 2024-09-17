import { TeamViewProps, TeamsListProps } from '@/lib/types';
import { ChangeEvent, useEffect, useState } from 'react';
import Team from '../team';

const TeamsList = ({
   playerIDs,
   setTeamsViewPlayers,
   teams,
   players,
   user,
}: TeamsListProps) => {
   const [draftedPlayers, setDraftedPlayers] = useState<Player[]>([]);
   const [doReset, setDoReset] = useState<boolean>(false);

   useEffect(() => {
      const foundPlayers: Player[] = [];
      for (let i = 0; i < playerIDs.length; i++) {
         const foundPlayer = players.find(
            (player) => player.id === playerIDs[i]
         );
         if (foundPlayer) {
            foundPlayers.push(foundPlayer);
         }
      }
      // const foundPlayers = players.filter((player) =>
      //    playerIDs.includes(player.id)
      // );
      setDraftedPlayers(foundPlayers);
   }, [playerIDs, players]);

   const teamProps: TeamViewProps = {
      players: draftedPlayers,
      doReset: doReset,
      setDoReset: setDoReset,
   };
   return (
      <div className="w-full h-full overflow-y-scroll">
         {user && teams && (
            <>
               <div className="w-full lg:sticky lg:top-0 h-[35px] bg-paper-primary dark:bg-gray-dark">
                  <select
                     className="text-black p-1 h-full"
                     onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setTeamsViewPlayers(e.target.value);
                        setDoReset(true);
                     }}
                     title="Select team"
                     defaultValue={''}
                  >
                     <option value="" disabled>
                        Select team
                     </option>
                     {teams
                        .filter((team: Team) => {
                           return team.owner !== user.id;
                        })
                        .map((team: Team) => {
                           return (
                              <option
                                 className="text-black"
                                 key={team.id}
                                 value={team.id}
                              >
                                 {team.team_name}
                              </option>
                           );
                        })}
                  </select>
               </div>
               <div>
                  <Team {...teamProps} />
               </div>
            </>
         )}
      </div>
   );
};

export default TeamsList;
