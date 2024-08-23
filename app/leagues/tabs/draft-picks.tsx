'use client';

import { DraftPick } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChangeEvent, useEffect, useState } from 'react';

export interface DraftPicksProps {
   league: League;
   teams: Team[];
   draft: Draft;
   numberOfRounds: number;
}

const DraftPicksTab = ({
   league,
   teams,
   draft,
   numberOfRounds,
}: DraftPicksProps) => {
   const [draftPicks, setDraftPicks] = useState<DraftPick[]>([]);
   const [draftPositions, setDraftPositions] = useState<number[]>([]);
   const [picks, setPicks] = useState<number[]>(
      Array.from({ length: teams.length }, (p, index) => {
         return index + 1;
      })
   );
   const [shouldSetDraftPicks, setShouldSetDraftPicks] =
      useState<boolean>(false);
   const supabase = createClientComponentClient<Database>();

   // const fetchLeagueDraftRules = async () => {
   //    if (league) {
   //       const { data } = await supabase
   //          .from('league_rules')
   //          .select('draft_picks')
   //          .match({ id: league?.league_rules });

   //       data &&
   //          (setDraftPicks(data?.[0]?.draft_picks),
   //          setShouldSetDraftPicks(true));
   //    }
   // };

   const handleSetDraftPicks = (team: Team, pick: number) => {
      if (!draftPositions.includes(pick)) {
         setDraftPositions((prev) => [...prev, pick]);
      } else {
         setDraftPositions(picks.filter((pickUsed) => pick !== pickUsed));
      }
      if (numberOfRounds > 0 && teams) {
         let tempPicks: number[] = [];
         const numberOfPicks = teams.length * numberOfRounds;
         for (let i = 1; i <= teams.length; i++) {
            if (i === pick) {
               for (let j = 0; j < numberOfPicks; j += teams.length) {
                  tempPicks.push(i + j);
               }
            }
         }
         const updatedDraftPicks: DraftPick[] = draftPicks.map((draftPick) => {
            if (draftPick.team_id === team.id) {
               return {
                  ...draftPick,
                  picks: tempPicks,
               };
            }

            return draftPick;
         });
         setDraftPicks(updatedDraftPicks);
      }
   };

   const handleSubmit = async () => {
      const { data, error } = await supabase
         .from('draft_picks')
         .upsert(draftPicks, {
            onConflict: 'team_id, draft_id',
         })
         .select();
      console.log(error);
   };

   useEffect(() => {
      if (draftPicks.length === 0) {
         const initialTeams = teams.map((team) => {
            return {
               team_id: team.id,
               draft_id: draft?.id ?? '',
               picks: [],
            };
         });
         setDraftPicks(initialTeams);
      }
   }, [teams]);
   useEffect(() => {
      // const draftPickStructure: any[] = [];
      // teams &&
      //    teams?.forEach((team: Team) => {
      //       const teamPick = {
      //          [String(team.id)]: [],
      //       };
      //       draftPickStructure.push(teamPick);
      //    });
      // console.log(draftPickStructure);
      // if (
      //    !draftPicks &&
      //    shouldSetDraftPicks &&
      //    draftPickStructure.length !== 0
      // ) {
      //    setDraftPicks([]);
      //    setShouldSetDraftPicks(false);
      // }
   }, [teams, draftPicks, shouldSetDraftPicks]);

   return (
      <>
         {teams?.map((team: Team) => {
            return (
               <TeamPicks
                  key={team.id}
                  team={team}
                  handleSetDraftPicks={handleSetDraftPicks}
                  picks={picks}
                  draftPositions={draftPositions}
               />
            );
         })}
         <button type="button" onClick={handleSubmit}>
            Submit
         </button>
      </>
   );
};

export default DraftPicksTab;

const TeamPicks = ({
   team,
   handleSetDraftPicks,
   picks,
   draftPositions,
}: {
   team: Team;
   handleSetDraftPicks: (team: Team, pick: number) => void;
   picks: number[];
   draftPositions: number[];
}) => {
   return (
      <div className="flex">
         <p className={'text-white'}>{team.team_name}</p>
         <select
            onChange={({ target }: ChangeEvent<HTMLSelectElement>) => {
               handleSetDraftPicks(team, Number(target.value));
            }}
            required
            name="draft_position"
            className="text-black"
            defaultValue={0}
         >
            <option value={0} className="text-black">
               Pick
            </option>
            {picks.map((p) => {
               return (
                  <option key={p} value={p}>
                     {p}
                  </option>
               );
            })}
         </select>
      </div>
   );
};
