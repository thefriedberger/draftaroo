'use client';

const RulesTab = (league?: League) => {
   return (
      <div className="flex flex-col">
         <label htmlFor="number_of_teams" className="text-white">
            Number of teams
         </label>
         <select
            name="number_of_teams"
            id="number-of-teams"
            className="mb-3 text-black bg-white p-1"
         >
            {Array.from({ length: 20 }).map((v, index: number) => (
               <option key={index} value={index}>
                  {index}
               </option>
            ))}
         </select>

         <div className="flex items-center p-1">
            <label className="mr-2" htmlFor="number_of_rounds">
               Number of rounds
            </label>
            <select
               name="number_of_rounds"
               id="number_of_rounds"
               className="text-black"
            >
               {Array.from({ length: 15 }).map((v, index: number) => (
                  <option key={index} value={index}>
                     {index}
                  </option>
               ))}
            </select>
         </div>

         <p className="text-white">Using keepers?</p>
         <div className="flex items-center p-1">
            <input
               type="radio"
               name="keepers_enabled"
               value="true"
               id="keepers_yes"
               className="mr-2 text-black"
            />
            <label htmlFor="keepers_yes">Yes</label>
         </div>

         <div className="flex items-center p-1">
            <input
               type="radio"
               name="keepers_enabled"
               value="false"
               id="keepers-no"
               className="mr-2 text-black"
            />
            <label htmlFor="keepers-no">No</label>
         </div>
      </div>
   );
};

export default RulesTab;
