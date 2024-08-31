import { TeamViewProps, TeamsListProps } from '@/lib/types';
import { ChangeEvent, useEffect, useState } from 'react';
import Team from '../team';

const TeamsList = ({
   playerIDs,
   setTeamsViewPlayers,
   teams,
   players,
   user,
   updateFeaturedPlayer,
}: TeamsListProps) => {
   const [draftedPlayers, setDraftedPlayers] = useState<Player[]>([]);
   const [doReset, setDoReset] = useState<boolean>(false);

   useEffect(() => {
      const foundPlayers = players.filter((player) =>
         playerIDs.includes(player.id)
      );
      setDraftedPlayers(foundPlayers);
   }, [playerIDs, players]);

   const teamProps: TeamViewProps = {
      players: draftedPlayers,
      doReset: doReset,
      setDoReset: setDoReset,
      updateFeaturedPlayer: updateFeaturedPlayer,
   };
   return (
      <div className="w-full h-full overflow-y-scroll">
         {user && teams && (
            <>
               <select
                  className="text-black p-1 md:fixed h-[35px]"
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
               <div className={'md:pt-[35px]'}>
                  <Team {...teamProps} />
               </div>
            </>
         )}
      </div>
   );
};

export default TeamsList;
