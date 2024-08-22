import { DraftOrderProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import DraftTile from '../draft-tile';

export type Pick = {
   playerID?: number;
   username: string;
   playerName?: string;
   draftPosition: number;
   yourPick: boolean;
   isKeeper: boolean;
};
const DraftOrder = ({
   teams,
   currentPick,
   draftedPlayers,
   isYourTurn,
   turnOrder,
   league,
   players,
   teamID,
   updateFeaturedPlayer,
}: DraftOrderProps) => {
   const [numberOfRounds, setNumberOfRounds] = useState<number>(0);
   const [picks, setPicks] = useState<Pick[] | any[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);

   const supabase = createClientComponentClient<Database>();

   useEffect(() => {
      const getLeagueRules = async () => {
         if (league) {
            const { data } = await supabase
               .from('league_rules')
               .select('*')
               .match({ id: league.league_rules });
            data && setNumberOfRounds(Number(data[0].number_of_rounds));
         }
      };
      numberOfRounds === 0 && getLeagueRules();
   }, [league]);

   const populatePicks = () => {
      const numberOfPicks = teams.length * numberOfRounds;
      const tempPicksArray = [];
      for (let j = 1; j <= numberOfPicks; j++) {
         const draftPosition = j;
         const pick: Pick = {
            draftPosition: draftPosition,
            username: '',
            yourPick: false,
            isKeeper: false,
         };
         for (const turn of turnOrder) {
            if (turn.picks.includes(draftPosition)) {
               pick.username = teams.filter((team: Team) => {
                  return team.id === turn.team_id;
               })?.[0]?.team_name;
               if (turn.team_id === teamID) {
                  pick.yourPick = true;
               }
            }
         }
         tempPicksArray.push(pick);
      }
      setPicks(tempPicksArray);
   };

   useEffect(() => {
      if (teams.length > 0 && turnOrder.length) populatePicks();
   }, [teams, numberOfRounds, turnOrder]);

   useEffect(() => {
      draftedPlayers.forEach((draftedPlayer) => {
         const foundPlayer = players.filter((player) => {
            return player.id === draftedPlayer.player_id;
         })[0];
         picks.forEach((pick: Pick) => {
            if (pick.draftPosition === draftedPlayer.pick) {
               pick.playerID = draftedPlayer.player_id;
               pick.playerName = `${
                  foundPlayer ? foundPlayer?.first_name.charAt(0) : 'No'
               }. ${foundPlayer ? foundPlayer?.last_name : 'Player'}`;
               pick.isKeeper = draftedPlayer.is_keeper;
            }
         });
      });
      setIsLoading(false);
   }, [draftedPlayers, players, picks]);

   return (
      <div className="draft-order overflow-y-scroll lg:h-full lg:border-r lg:border-paper-dark dark:lg:border-gray-300">
         {!isLoading &&
            picks?.map((pick: Pick, index: number) => {
               return (
                  <div key={index}>
                     {pick.draftPosition % teams?.length === 1 && (
                        <div
                           className={
                              'bg-emerald-primary text-white dark:text-black p-2'
                           }
                        >
                           Round&nbsp;
                           {pick.draftPosition === 1
                              ? 1
                              : Math.floor(
                                   pick.draftPosition / teams.length + 1
                                )}
                        </div>
                     )}
                     <DraftTile
                        pick={pick}
                        currentPick={currentPick}
                        playerSelected={draftedPlayers[pick.playerID || 0]}
                        isYourTurn={isYourTurn}
                        updateFeaturedPlayer={updateFeaturedPlayer}
                     />
                  </div>
               );
            })}
      </div>
   );
};

export default DraftOrder;
