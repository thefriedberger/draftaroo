'use client';
const ScoringTab = (league?: League) => {
   return (
      <div className="flex flex-col">
         <p className="text-white mb-3">Set scoring values for league:</p>

         <div className="flex flex-col lg:flex-row justify-between">
            <label htmlFor="goals" className="text-white mr-2">
               Goals
            </label>
            <input name="goals" id="goals" className="mb-3 p-1 text-black" />
         </div>

         <div className="flex flex-col lg:flex-row justify-between">
            <label htmlFor="assists" className="text-white mr-2">
               Assists
            </label>
            <input
               name="assists"
               id="assists"
               className="mb-3 p-1 text-black"
            />
         </div>

         <div className="flex flex-col lg:flex-row justify-between">
            <label htmlFor="plus_minus" className="text-white mr-2">
               Plus/Minus (+/-)
            </label>
            <input
               name="plus_minus"
               id="plus_minus"
               className="mb-3 p-1 text-black"
            />
         </div>

         <div className="flex flex-col lg:flex-row justify-between">
            <label htmlFor="pim" className="text-white mr-2">
               Penalty Minutes (PIM)
            </label>
            <input name="pim" id="pim" className="mb-3 p-1 text-black" />
         </div>

         <div className="flex flex-col lg:flex-row justify-between">
            <label htmlFor="ppg" className="text-white mr-2">
               Powerplay Goals (PPG)
            </label>
            <input name="ppg" id="ppg" className="mb-3 p-1 text-black" />
         </div>

         <div className="flex flex-col lg:flex-row justify-between">
            <label htmlFor="ppa" className="text-white mr-2">
               Powerplay Assists (PPA)
            </label>
            <input name="ppa" id="ppa" className="mb-3 p-1 text-black" />
         </div>

         <div className="flex flex-col lg:flex-row justify-between">
            <label htmlFor="shg" className="text-white mr-2">
               Shorthanded Goals (SHG)
            </label>
            <input name="shg" id="shg" className="mb-3 p-1 text-black" />
         </div>

         <div className="flex flex-col lg:flex-row justify-between">
            <label htmlFor="sha" className="text-white mr-2">
               Shorthanded Assists (SHA)
            </label>
            <input name="sha" id="sha" className="mb-3 p-1 text-black" />
         </div>

         <div className="flex flex-col lg:flex-row justify-between">
            <label htmlFor="shots" className="text-white mr-2">
               Shots
            </label>
            <input name="shots" id="shots" className="mb-3 p-1 text-black" />
         </div>

         <div className="flex flex-col lg:flex-row justify-between">
            <label htmlFor="hits" className="text-white mr-2">
               Hits
            </label>
            <input name="hits" id="hits" className="mb-3 p-1 text-black" />
         </div>

         <div className="flex flex-col lg:flex-row justify-between">
            <label htmlFor="blocks" className="text-white mr-2">
               Blocks
            </label>
            <input name="blocks" id="blocks" className="mb-3 p-1 text-black" />
         </div>
      </div>
   );
};

export default ScoringTab;
