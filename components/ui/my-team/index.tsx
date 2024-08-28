import { MyTeamProps, TeamViewProps } from '@/lib/types';
import { useEffect, useState } from 'react';
import Team from '../team';

const MyTeam = ({ playerIDs, players, updateFeaturedPlayer }: MyTeamProps) => {
   const [draftedPlayers, setDraftedPlayers] = useState<Player[]>([]);

   useEffect(() => {
      const foundPlayers = players.filter((player) =>
         playerIDs.includes(player.id)
      );
      setDraftedPlayers(foundPlayers);
   }, [playerIDs, players]);

   const teamProps: TeamViewProps = {
      players: draftedPlayers,
      updateFeaturedPlayer: updateFeaturedPlayer,
   };
   return (
      <div className="lg:h-[40%] overflow-y-scroll lg:border-l lg:border-gray-300">
         <h2 className="hidden lg:block text-black bg-gray-300 p-2">My Team</h2>
         <Team {...teamProps} />
      </div>
   );
};

export default MyTeam;
