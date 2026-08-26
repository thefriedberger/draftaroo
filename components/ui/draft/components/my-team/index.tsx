import { MyTeamProps, TeamViewProps } from '@/lib/types';
import Team from '../team';

const MyTeam = ({ draftedPlayers }: MyTeamProps) => {
   const teamProps: TeamViewProps = {
      players: draftedPlayers,
      myTeam: true,
   };
   return (
      <div className="max-h-full lg:min-h-[40%] lg:max-h-full mb-2 overflow-y-scroll lg:border-l lg:border-paper-dark">
         <Team {...teamProps} />
      </div>
   );
};

export default MyTeam;
