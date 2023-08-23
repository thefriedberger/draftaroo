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
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
         </select>

         <div className="flex items-center p-1">
            <label className="mr-2" htmlFor="number_of_rounds">
               Number of rounds
            </label>
            <input
               type="number"
               name="number_of_rounds"
               id="number_of_rounds"
               className="text-black"
               min={15}
            />
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
