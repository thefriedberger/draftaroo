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

   useEffect(() => {
      if (playerIDs.length === 0) {
         setDraftedPlayers([]);
      } else {
         const tempPlayers: Player[] = [];
         players.forEach((player: Player) => {
            playerIDs.includes(player.id) && tempPlayers.push(player);
         });
         setDraftedPlayers(tempPlayers);
      }
   }, [playerIDs, players]);

   const teamProps: TeamViewProps = {
      players: draftedPlayers,
   };
   return (
      <div className="w-full">
         {user && teams && (
            <>
               <select
                  className="text-black p-1"
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                     setTeamsViewPlayers(e.target.value)
                  }
               >
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
               <Team {...teamProps} />
            </>
         )}
      </div>
   );
};

export default TeamsList;
