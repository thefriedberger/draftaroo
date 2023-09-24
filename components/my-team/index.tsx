import { MyTeamProps, TeamViewProps } from '@/lib/types';
import { useEffect, useState } from 'react';
import Team from '../team';

const MyTeam = ({ playerIDs, players }: MyTeamProps) => {
   const [draftedPlayers, setDraftedPlayers] = useState<Player[]>([]);

   useEffect(() => {
      players.forEach((player: Player) => {
         playerIDs.includes(player.id) &&
            setDraftedPlayers((prev: Player[]) => [...prev, player]);
      });
   }, [playerIDs, players]);

   const teamProps: TeamViewProps = {
      players: draftedPlayers,
   };
   return (
      <div className="lg:max-h-[65vh] overflow-y-scroll lg:border-l lg:border-gray-300">
         <h2 className="text-black bg-gray-300 p-2">My Team</h2>
         <Team {...teamProps} />
      </div>
   );
};

export default MyTeam;
