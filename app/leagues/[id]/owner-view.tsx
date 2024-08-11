'use server';

import getPlayers from '@/app/utils/get-players';
import { fetchTeams } from '@/app/utils/helpers';
import Tabs from '@/components/ui/tabs';
import { Tab, TabProps } from '@/lib/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import DraftPicksTab from '../tabs/draft-picks';
import RostersTab, { RosterProps } from '../tabs/rosters';
import RulesTab from '../tabs/rules';
import ScoringTab from '../tabs/scoring';
import TeamsTab from '../tabs/teams';

export interface OwnerViewProps {
   league: League | null | undefined;
   draft: Draft | null | undefined;
}
const OwnerView = async ({ league, draft }: OwnerViewProps) => {
   const supabase = createServerComponentClient<Database>({ cookies });
   const players: any =
      league?.league_id && (await getPlayers(league.league_id));
   const teams: any =
      league?.league_id && (await fetchTeams(supabase, league.league_id));
   const rosterProps: RosterProps = {
      league: league,
      players: players,
      teams: teams,
      draft: draft,
   };
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
         tabPane: <TeamsTab league={league} />,
      },
      {
         tabButton: 'Manage Rosters',
         tabPane: <RostersTab {...rosterProps} />,
      },
      {
         tabButton: 'Manage Draft Pick',
         tabPane: <DraftPicksTab league={league} />,
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
