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
      <div className="lg:min-h-[40%] lg:max-h-full mb-2 overflow-y-scroll lg:border-l lg:border-paper-dark">
         <h2 className="hidden lg:block text-black bg-paper-dark dark:bg-blue-muted px-2 py-1 sticky top-0">
            My Team
         </h2>
         <Team {...teamProps} />
      </div>
   );
};

export default MyTeam;
