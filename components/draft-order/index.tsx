import { DraftOrderProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import DraftTile from '../draft-tile';

export type Pick = {
   playerID: number | null;
   username: string;
   playerName: string | null;
   draftPosition: number;
   yourPick: boolean;
};
const DraftOrder = ({
   teams,
   currentPick,
   draftedPlayers,
   isYourTurn,
   turnOrder,
   league,
   players,
}: DraftOrderProps) => {
   const [numberOfRounds, setNumberOfRounds] = useState<number>(0);
   const [picks, setPicks] = useState<Pick[] | any[]>([]);

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
      if (teams.length > 0) {
         const numberOfPicks = teams.length * numberOfRounds;
         const tempPicksArray = [];
         for (let j = 1; j <= numberOfPicks; j++) {
            const draftPosition = j;
            const pick: Pick = {
               draftPosition: draftPosition,
               username: '',
               playerID: null,
               yourPick: false,
               playerName: null,
            };
            for (const turn in turnOrder) {
               if (turnOrder[turn].includes(draftPosition)) {
                  pick.username = teams.filter((team: Team) => {
                     return team.id === turn;
                  })[0]?.team_name;
               }
            }
            // for (const draftedPlayer of draftedPlayers) {
            //    if (draftedPlayer.pick === draftPosition)
            //       pick.playerID === draftedPlayer.player_id;
            // }

            tempPicksArray.push(pick);
         }
         setPicks(tempPicksArray);
      }
   };

   useEffect(() => {
      populatePicks();
   }, [teams, numberOfRounds]);

   useEffect(() => {
      draftedPlayers.forEach((draftedPlayer) => {
         const foundPlayer = players.filter((player) => {
            console.log(player.id === draftedPlayer.player_id);
            return player.id === draftedPlayer.player_id;
         })[0];
         picks.forEach((pick: Pick) => {
            if (pick.draftPosition === draftedPlayer.pick) {
               pick.playerID = draftedPlayer.player_id;
               pick.playerName = `${foundPlayer?.first_name.charAt(0)}. ${
                  foundPlayer?.last_name
               }`;
            }
         });
      });
   }, [draftedPlayers, players, picks]);

   return (
      <div className="max-h-[65vh] overflow-y-scroll">
         {picks?.map((pick: Pick) => {
            return (
               <>
                  {pick.draftPosition % teams?.length === 1 && (
                     <div className={'dark:bg-gray-300 dark:text-black'}>
                        Round&nbsp;
                        {pick.draftPosition === 1
                           ? 1
                           : Math.floor(pick.draftPosition / teams.length + 1)}
                     </div>
                  )}
                  <DraftTile
                     key={pick.playerID}
                     pick={pick}
                     currentPick={currentPick}
                     playerSelected={draftedPlayers[pick.playerID || 0]}
                  />
               </>
            );
         })}
      </div>
   );
};

export default DraftOrder;
