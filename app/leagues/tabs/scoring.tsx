'use client';

import updateLeagueScoring from '@/app/utils/update-league-scoring';

export interface ScoringTabProps {
   league?: League;
   leagueScoring?: { [key: string]: LeagueScoring } | any;
}
const ScoringTab = ({ league, leagueScoring }: ScoringTabProps) => {
   const goalieStats = leagueScoring
      ? Object.keys(leagueScoring).filter((key) =>
           ['wins', 'goalsAgainst', 'shutouts', 'saves'].includes(key)
        )
      : ['wins', 'goalsAgainst', 'shutouts', 'saves'];
   const skaterStats = leagueScoring
      ? Object.keys(leagueScoring).filter(
           (key) =>
              !['id', 'wins', 'goalsAgainst', 'shutouts', 'saves'].includes(key)
        )
      : [
           'goals',
           'assists',
           'plusMinus',
           'powerPlayGoals',
           'powerPlayAssists',
           'powerPlayPoints',
           'shortHandedGoals',
           'shortHandedAssists',
           'shortHandedPoints',
           'hits',
           'shots',
           'blocked',
           'pim',
        ];

   return (
      <>
         {leagueScoring ? (
            <form
               action={(formData: FormData) =>
                  updateLeagueScoring(formData, leagueScoring.id)
               }
            >
               <div className="flex flex-col bg-gray-primary rounded-md rounded-t-none p-4">
                  <h3 className="text-white mb-3 text-xl">Skater scoring</h3>
                  {skaterStats.map((score: string) => {
                     const spacedName = score
                        ?.match(/[A-Z]?[^A-Z]*/g)
                        ?.join(' ');
                     const scoringInputProps: ScoringInputProps = {
                        displayName: spacedName
                           ? spacedName?.charAt(0).toLocaleUpperCase() +
                             spacedName?.substring(1)
                           : '',
                        name: score,
                        initialValue: Number(leagueScoring?.[score]),
                     };
                     return (
                        <div
                           className="flex flex-col lg:flex-row justify-between"
                           key={score}
                        >
                           <ScoringInput {...scoringInputProps} />
                        </div>
                     );
                  })}
               </div>

               <div className="flex flex-col bg-gray-primary rounded-md p-4 mt-3">
                  <h3 className="text-white mb-3 text-xl">
                     Goaltender scoring
                  </h3>
                  {goalieStats.map((score: string) => {
                     const spacedName = score
                        ?.match(/[A-Z]?[^A-Z]*/g)
                        ?.join(' ');
                     const scoringInputProps: ScoringInputProps = {
                        displayName: spacedName
                           ? spacedName?.charAt(0).toLocaleUpperCase() +
                             spacedName?.substring(1)
                           : '',
                        name: score,
                        initialValue: Number(leagueScoring?.[score]),
                     };
                     return (
                        <div
                           className="flex flex-col lg:flex-row justify-between"
                           key={score}
                        >
                           <ScoringInput {...scoringInputProps} />
                        </div>
                     );
                  })}
               </div>
               <button
                  className={
                     'bg-emerald-primary rounded px-4 py-2 text-white mb-3 self-center mt-2'
                  }
                  type="submit"
               >
                  Submit
               </button>
            </form>
         ) : (
            <>
               <div className="flex flex-col bg-gray-primary rounded-md rounded-t-none p-4">
                  <h3 className="text-white mb-3 text-xl">Skater scoring</h3>
                  {skaterStats.map((score: string) => {
                     const spacedName = score
                        ?.match(/[A-Z]?[^A-Z]*/g)
                        ?.join(' ');
                     const scoringInputProps: ScoringInputProps = {
                        displayName: spacedName
                           ? spacedName?.charAt(0).toLocaleUpperCase() +
                             spacedName?.substring(1)
                           : '',
                        name: score,
                     };
                     return (
                        <div
                           className="flex flex-col lg:flex-row justify-between"
                           key={score}
                        >
                           <ScoringInput {...scoringInputProps} />
                        </div>
                     );
                  })}
               </div>

               <div className="flex flex-col bg-gray-primary rounded-md p-4 mt-3">
                  <h3 className="text-white mb-3 text-xl">
                     Goaltender scoring
                  </h3>
                  {goalieStats.map((score: string) => {
                     const spacedName = score
                        ?.match(/[A-Z]?[^A-Z]*/g)
                        ?.join(' ');
                     const scoringInputProps: ScoringInputProps = {
                        displayName: spacedName
                           ? spacedName?.charAt(0).toLocaleUpperCase() +
                             spacedName?.substring(1)
                           : '',
                        name: score,
                     };
                     return (
                        <div
                           className="flex flex-col lg:flex-row justify-between"
                           key={score}
                        >
                           <ScoringInput {...scoringInputProps} />
                        </div>
                     );
                  })}
               </div>
            </>
         )}
      </>
   );
};
export default ScoringTab;
export interface ScoringInputProps {
   name: string;
   initialValue?: number;
   displayName: string;
}
const ScoringInput = ({
   name,
   initialValue,
   displayName,
}: ScoringInputProps) => {
   return (
      <>
         <label htmlFor={name} className="text-white mr-2">
            {displayName}
         </label>
         <input
            name={name}
            id={name}
            defaultValue={initialValue ?? 0}
            className="mb-3 p-1 text-black"
         />
      </>
   );
};
