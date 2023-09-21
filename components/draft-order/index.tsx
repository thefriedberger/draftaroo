import { DraftOrderProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import DraftTile from '../draft-tile';

export type Pick = {
   playerID: number;
   displayName: string;
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
}: DraftOrderProps) => {
   const [numberOfRounds, setNumberOfRounds] = useState<number>(0);
   const [picks, setPicks] = useState<Pick[]>();

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

   useEffect(() => {
      if (teams.length > 0) {
         for (let i = 1; i <= teams.length; i++) {
            for (let j = 1; j <= numberOfRounds; j++) {}
         }
      }
   }, [teams, numberOfRounds]);
   return (
      <>
         {picks?.map((pick: Pick) => {
            return (
               <>
                  {pick.draftPosition === 1 ? (
                     <div className={''}>Round 1</div>
                  ) : (
                     pick.draftPosition % 8 === 1 && (
                        <div className={''}>
                           Round&nbsp;
                           {Math.floor(pick.draftPosition / 8 + 1)}
                        </div>
                     )
                  )}
                  <DraftTile
                     key={pick.playerID}
                     pick={pick}
                     currentPick={currentPick}
                     playerSelected={draftedPlayers[pick.playerID]}
                  />
               </>
            );
         })}
      </>
   );
};

export default DraftOrder;
