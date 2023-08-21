import Tabs from '@/components/tabs';
import { Tab, TabProps } from '@/lib/types';
import DraftTab from './tabs/draft';
import RulesTab from './tabs/rules';
import ScoringTab from './tabs/scoring';
import TeamsTab from './tabs/teams';

const OwnerView = (league: League | any) => {
   const tabs: Tab[] = [
      {
         tabButton: 'Manage Rules',
         tabPane: <RulesTab />,
      },
      {
         tabButton: 'Manage Scoring',
         tabPane: <ScoringTab />,
      },
      {
         tabButton: 'Manage Teams',
         tabPane: <TeamsTab {...league} />,
      },
      {
         tabButton: 'Manage Draft',
         tabPane: <DraftTab />,
      },
   ];
   const tabProps: TabProps = {
      tabs,
      className: 'flex flex-col w-full lg:max-w-screen-xl text-white mt-5',
   };
   return (
      <>
         <Tabs {...tabProps} />
      </>
   );
};

export default OwnerView;
