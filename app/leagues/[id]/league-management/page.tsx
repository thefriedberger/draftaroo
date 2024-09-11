'use server';

import getPlayers from '@/app/utils/get-players';
import {
   fetchDraftById,
   fetchLeague,
   fetchLeagueRules,
   fetchLeagueScoring,
   fetchTeams,
} from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/server';
import Tabs from '@/components/ui/tabs';
import { Tab, TabProps } from '@/lib/types';
import DraftPicksTab, { DraftPicksProps } from '../../tabs/draft-picks';
import RostersTab, { RosterProps } from '../../tabs/rosters';
import RulesTab from '../../tabs/rules';
import ScoringTab, { ScoringTabProps } from '../../tabs/scoring';
import TeamsTab from '../../tabs/teams';

const LeagueManagement = async ({
   params: { id },
}: {
   params: { id: string };
}) => {
   const supabase = createClient();
   const players: Awaited<Player[]> = await getPlayers(id);
   const league: Awaited<League> = await fetchLeague(supabase, id);
   const teams: Awaited<Team[]> = await fetchTeams(supabase, league);
   const draft: Awaited<Draft> = await fetchDraftById(supabase, id);

   const leagueRules: Awaited<LeagueRules> = await fetchLeagueRules(
      supabase,
      league
   );
   const leagueScoring: Awaited<LeagueScoring> = await fetchLeagueScoring(
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

   const scoringTabProps: ScoringTabProps = {
      league: league,
      leagueScoring: leagueScoring,
   };
   const tabs: Tab[] = [
      {
         tabButton: 'Rules',
         tabPane: <RulesTab {...league} />,
      },
      {
         tabButton: 'Scoring',
         tabPane: <ScoringTab {...scoringTabProps} />,
      },
      {
         tabButton: 'Teams',
         tabPane: <TeamsTab league={league} />,
      },
      {
         tabButton: 'Rosters',
         tabPane: <RostersTab {...rosterProps} />,
      },
      {
         tabButton: 'Draft Picks',
         tabPane: <DraftPicksTab {...draftPicksProps} />,
      },
   ];
   const tabProps: TabProps = {
      tabs,
      className:
         'flex flex-col items-center w-full lg:max-w-screen-xl text-white mt-5',
   };
   return (
      <div className={'container'}>
         <Tabs {...tabProps} />
      </div>
   );
};

export default LeagueManagement;
