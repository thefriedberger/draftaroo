import { MyTeamProps, TeamViewProps } from '@/lib/types';
import { useEffect, useState } from 'react';
import Team from '../team';

const MyTeam = ({ playerIDs, players }: MyTeamProps) => {
   const [draftedPlayers, setDraftedPlayers] = useState<Player[]>([]);

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
      setDraftedPlayers(foundPlayers);
   }, [playerIDs, players]);

   const teamProps: TeamViewProps = {
      players: draftedPlayers,
   };
   return (
      <div className="max-h-full lg:min-h-[40%] lg:max-h-full mb-2 overflow-y-scroll lg:border-l lg:border-paper-dark">
         <h2 className="hidden lg:block text-black bg-paper-dark dark:bg-blue-muted px-2 py-[.35rem] sticky top-0">
            My Team
         </h2>
         <Team {...teamProps} />
      </div>
   );
};

export default MyTeam;
