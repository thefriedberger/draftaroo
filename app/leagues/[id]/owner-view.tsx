'use server';

import getPlayers from '@/app/utils/get-players';
import { fetchLeagueRules, fetchTeams } from '@/app/utils/helpers';
import Tabs from '@/components/ui/tabs';
import { Tab, TabProps } from '@/lib/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import DraftPicksTab, { DraftPicksProps } from '../tabs/draft-picks';
import RostersTab, { RosterProps } from '../tabs/rosters';
import RulesTab from '../tabs/rules';
import ScoringTab from '../tabs/scoring';
import TeamsTab from '../tabs/teams';

export interface OwnerViewProps {
   league: League;
   draft: Draft;
}
const OwnerView = async ({ league, draft }: OwnerViewProps) => {
   if (!league?.league_id) return;

   const supabase = createServerComponentClient<Database>({ cookies });
   const players: Awaited<Player[]> = await getPlayers(league.league_id);
   const teams: Awaited<Team[]> = await fetchTeams(supabase, league.league_id);
   const leagueRules: Awaited<LeagueRules> = await fetchLeagueRules(
      supabase,
      league
   );
   const rosterProps: RosterProps = {
      league: league,
      players: players,
      teams: teams,
      draft: draft,
   };

   const draftPicksProps: DraftPicksProps = {
      league: league,
      teams: teams,
      draft: draft,
      numberOfRounds: leagueRules.number_of_rounds ?? 0,
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
         tabPane: <DraftPicksTab {...draftPicksProps} />,
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
