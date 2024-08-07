import Tabs from '@/components/ui/tabs';
import { Tab, TabProps } from '@/lib/types';
import DraftPicksTab from '../tabs/draft-picks';
import RostersTab from '../tabs/rosters';
import RulesTab from '../tabs/rules';
import ScoringTab from '../tabs/scoring';
import TeamsTab from '../tabs/teams';

const OwnerView = (league: League | any) => {
   const tabs: Tab[] = [
      {
         tabButton: 'Manage Rules',
         tabPane: <RulesTab {...league} />,
      },
      {
         tabButton: 'Manage Scoring',
         tabPane: <ScoringTab {...league} />,
      },
      {
         tabButton: 'Manage Teams',
         tabPane: <TeamsTab {...league} />,
      },
      {
         tabButton: 'Manage Rosters',
         tabPane: <RostersTab {...league} />,
      },
      {
         tabButton: 'Manage Draft Pick',
         tabPane: <DraftPicksTab {...league} />,
      },
   ];
   const tabProps: TabProps = {
      tabs,
      className: 'flex flex-col w-full lg:max-w-screen-xl text-white mt-5',
   };
   return (
      <div className={'container'}>
         <Tabs {...tabProps} />
      </div>
   );
};

export default OwnerView;
