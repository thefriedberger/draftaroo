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
      <>
         <h2>My Team</h2>
         <Team {...teamProps} />
      </>
   );
};

export default MyTeam;
