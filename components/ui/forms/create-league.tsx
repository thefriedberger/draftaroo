'use client';

import RulesTab from '@/app/leagues/tabs/rules';
import ScoringTab from '@/app/leagues/tabs/scoring';
import createLeague from '@/app/utils/create-league';
import { PageContext } from '@/components/context/page-context';
import { Tab, TabProps } from '@/lib/types';
import { useContext, useState } from 'react';
import Tabs from '../tabs';

const CreateLeagueForm = () => {
   const { user } = useContext(PageContext);
   const [draftPicks, setDraftPicks] = useState();

   const tabs: Tab[] = [
      {
         tabButton: 'League Rules',
         tabPane: <RulesTab />,
      },
      {
         tabButton: 'Scoring',
         tabPane: <ScoringTab />,
      },
   ];
   const tabProps: TabProps = {
      tabs,
      className: 'flex flex-col w-full lg:max-w-screen-xl text-white',
   };
   if (!user) return <></>;
   return (
      <form
         action={(formData: FormData) =>
            createLeague(formData, draftPicks, user)
         }
         className="flex flex-col w-full lg:w-full max-w-full lg:max-w-2xl p-4"
      >
         <label htmlFor="league-name" className="text-white">
            League Name
         </label>
         <input
            type="text"
            name="league-name"
            id="league-name"
            className="mb-3 p-1 text-black"
            required
         />

         <Tabs {...tabProps} />
         <button
            type="submit"
            className="bg-white dark:text-black rounded-md mx-auto max-w-min-content p-2 mt-2"
         >
            Submit
         </button>
      </form>
   );
};

export default CreateLeagueForm;
