import { MyTeamProps, TeamViewProps } from '@/lib/types';
import Team from '../team';

const MyTeam = ({ draftedPlayers }: MyTeamProps) => {
   const teamProps: TeamViewProps = {
      players: draftedPlayers,
      myTeam: true,
   };
   return (
      <div className="max-h-full lg:min-h-[40%] lg:max-h-full rounded-md overflow-y-scroll">
         <Team {...teamProps} />
      </div>
   );
};

export default MyTeam;
