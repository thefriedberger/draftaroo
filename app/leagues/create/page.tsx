'use client';

import { PageContext } from '@/components/context/page-context';
import Tabs from '@/components/tabs';
import { Tab, TabProps } from '@/lib/types';
import createLeague from '@/utils/create-league';
import { useContext, useState } from 'react';
import RulesTab from './tabs/rules';
import ScoringTab from './tabs/scoring';

const CreateLeague = () => {
   const { session, user, profile } = useContext(PageContext);
   const [draftPicks, setDraftPicks] = useState();

   const [currentUser, setCurrentUser] = useState(profile?.[0]);

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

   return (
      <>
         {session && user && (
            <>
               <h1 className="my-2 text-3xl text-white">
                  Welcome, {currentUser?.first_name && currentUser.first_name}
               </h1>
               <p>Ready to create a league? Fill out the thing below</p>
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
                     className="bg-white rounded-md mx-auto max-w-min-content p-2"
                  >
                     Submit
                  </button>
               </form>
            </>
         )}
         {!session && (
            <h1 className="text-3xl lg:max-w-lg text-white">
               Please login to make changes
            </h1>
         )}
      </>
   );
};

export default CreateLeague;
