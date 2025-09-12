'use server';

import getPlayers from '@/app/utils/get-players';
import {
   fetchDraftByLeague,
   fetchLeague,
   fetchLeagueRules,
   fetchLeagueScoring,
   fetchTeams,
   getUser,
} from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/server';
import Tabs from '@/components/ui/tabs';
import { Tab, TabProps } from '@/lib/types';
import { User } from '@supabase/supabase-js';
import DraftPicksTab, { DraftPicksProps } from '../../tabs/draft-picks';
import RostersTab, { RosterProps } from '../../tabs/rosters';
import RulesTab from '../../tabs/rules';
import ScoringTab, { ScoringTabProps } from '../../tabs/scoring';
import TeamsTab from '../../tabs/teams';
import CreateDraftButton from './create-draft-button';

const LeagueManagement = async ({
   params: { id },
}: {
   params: { id: string };
}) => {
   const supabase = createClient();

   const user: Awaited<User | null> = await getUser(supabase);
   const league: Awaited<League> = await fetchLeague(supabase, id);
   const players: Awaited<Player[]> = await getPlayers(league);
   const teams: Awaited<Team[]> = await fetchTeams(
      supabase,
      league.league_id as string
   );
   const draft: Awaited<Draft> = await fetchDraftByLeague(
      supabase,
      id,
      new Date().getUTCFullYear()
   );

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
      gridColumns: 'grid-cols-5',
   };
   return (
      <div className={'container'}>
         {league && user && league.owner === user.id && !draft && (
            <CreateDraftButton league={league} />
         )}
         <Tabs {...tabProps} />
      </div>
   );
};

export default LeagueManagement;
