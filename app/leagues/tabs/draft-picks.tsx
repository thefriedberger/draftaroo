'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';

const DraftPicksTab = ({ league }: { league: League }) => {
   const [teams, setTeams] = useState<Team[]>();
   const [draftPicks, setDraftPicks] = useState<any[] | any>({});
   const [numberOfRounds, setNumberOfRounds] = useState<number>();
   const [draftPositions, setDraftPositions] = useState<number[] | any[]>([]);
   const [options, setOptions] = useState<ReactElement<HTMLOptionElement>[]>(
      []
   );
   const [shouldSetDraftPicks, setShouldSetDraftPicks] =
      useState<boolean>(false);
   const supabase = createClientComponentClient<Database>();

   const fetchLeagueDraftRules = async () => {
      if (league) {
         const { data } = await supabase
            .from('league_rules')
            .select('draft_picks')
            .match({ id: league?.league_rules });

         data &&
            (setDraftPicks(data?.[0]?.draft_picks),
            setShouldSetDraftPicks(true));
      }
   };
   const fetchNumberOfRounds = async () => {
      if (league) {
         const { data } = await supabase
            .from('league_rules')
            .select('number_of_rounds')
            .match({ id: league?.league_rules });
         data && setNumberOfRounds(Number(data[0].number_of_rounds));
      }
   };
   const fetchLeagueTeams = async () => {
      const { data } = await supabase
         .from('teams')
         .select('*')
         .match({ league_id: league?.league_id });
      data && setTeams(data);
   };

   const handleSetDraftPicks = (team: Team, pick: number) => {
      setDraftPositions((prev) => [...prev, pick]);
      if (numberOfRounds && teams) {
         let tempPicks: number[] = [];
         const numberOfPicks = teams.length * numberOfRounds;
         for (let i = 1; i <= teams.length; i++) {
            if (i === pick) {
               for (let j = 0; j < numberOfPicks; j += teams.length) {
                  tempPicks.push(i + j);
               }
            }
         }
         draftPicks[String(team.id)] = tempPicks;
      }
   };

   const handleSubmit = async () => {
      const { error } = await supabase
         .from('league_rules')
         .update({ draft_picks: draftPicks })
         .match({ id: league?.league_rules });
   };

   const updateSelectedOptions = (optionValue: string | number) => {};

   useEffect(() => {
      // fetchLeagueDraftRules();
      fetchLeagueTeams();
      fetchNumberOfRounds();
   }, [league]);

   useEffect(() => {
      if (teams && options.length === 0) {
         const defaultOption: ReactElement<HTMLOptionElement> = (
            <option value={0} className="text-black" disabled>
               Pick
            </option>
         );
         setOptions((prev) => [...prev, defaultOption]);
         for (let i = 1; i <= teams.length; i++) {
            const newOption: ReactElement<HTMLOptionElement> = (
               <option value={i} className="text-black">
                  {i}
               </option>
            );
            setOptions((prev) => [...prev, newOption]);
         }
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
                  options={options}
                  updateSelectedOptions={updateSelectedOptions}
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
   options,
   updateSelectedOptions,
}: {
   team: Team;
   handleSetDraftPicks: (team: Team, pick: number) => void;
   options: ReactElement<HTMLOptionElement>[];
   updateSelectedOptions: (option: string | number) => void;
}) => {
   const updateDraftPosition = (e: ChangeEvent) => {
      const target = e.target as HTMLInputElement;
      handleSetDraftPicks(team, Number(target.value));
   };
   return (
      <div className="flex">
         <p className={'text-white'}>{team.team_name}</p>
         <select
            onChange={updateDraftPosition}
            required
            name="draft_position"
            className="text-black"
            defaultValue={0}
         >
            {options}
         </select>
      </div>
   );
};
