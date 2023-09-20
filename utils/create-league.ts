'use server';
import {
   User,
   createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const createLeague = async (
   formData: FormData,
   draftPicks: any,
   user: User
) => {
   const leagueName = String(formData.get('league-name'));
   const rules = {
      number_of_teams: Number(formData.get('number_of_teams')),
      keepers_enabled: Boolean(formData.get('keepers_enabled')),
      number_of_rounds: Number(formData.get('number_of_picks')),
      draft_picks: draftPicks,
      draft_style: String(formData.get('draft_style')),
   };
   const scoring = {
      goals: Number(formData.get('goals')),
      assists: Number(formData.get('assists')),
      plus_minus: Number(formData.get('plus_minus')),
      pim: Number(formData.get('pim')),
      powerplay_goals: Number(formData.get('ppg')),
      powerplay_assists: Number(formData.get('ppa')),
      powerplay_points: Number(formData.get('ppp')),
      shorthanded_goals: Number(formData.get('shg')),
      shorthanded_assists: Number(formData.get('sha')),
      shorthanded_points: Number(formData.get('shp')),
      shots: Number(formData.get('shots')),
      hits: Number(formData.get('hits')),
      blocks: Number(formData.get('blocks')),
      wins: Number(formData.get('wins')),
      goals_against: Number(formData.get('goals_against')),
      saves: Number(formData.get('saves')),
      shutouts: Number(formData.get('shutouts')),
   };
   const {
      goals,
      assists,
      powerplay_assists,
      powerplay_goals,
      powerplay_points,
      plus_minus,
      shorthanded_assists,
      shorthanded_goals,
      shorthanded_points,
      hits,
      blocks,
      pim,
      shots,
      wins,
      saves,
      goals_against,
      shutouts,
   } = scoring;
   const {
      keepers_enabled,
      number_of_rounds,
      number_of_teams,
      draft_style,
      draft_picks,
   } = rules;

   const generateLeagueId = async () => {
      const supabase = createServerComponentClient<Database>({ cookies });
      const { data } = await supabase.from('leagues').select('league_id');
      let leagueId;
      if (data?.length === 0) {
         return Math.random().toString(30).slice(2);
      }
      data?.forEach((league) => {
         leagueId = Math.random().toString(30).slice(2);
         do {
            leagueId = Math.random().toString(30).slice(2);
         } while (league.league_id === leagueId);
      });
      return leagueId;
   };

   const leagueId = await generateLeagueId();

   const supabase = createServerComponentClient<Database>({ cookies });

   const league_scoring = await supabase
      .from('league_scoring')
      .insert({
         goals: goals,
         assists: assists,
         powerPlayAssists: powerplay_assists,
         powerPlayGoals: powerplay_goals,
         powerPlayPoints: powerplay_points,
         plusMinus: plus_minus,
         shortHandedAssists: shorthanded_assists,
         shortHandedGoals: shorthanded_goals,
         shortHandedPoints: shorthanded_points,
         hits: hits,
         blocked: blocks,
         shots: shots,
         wins: wins,
         pim: pim,
         saves: saves,
         goalsAgainst: goals_against,
         shutouts: shutouts,
      })
      .select();
   const league_rules = await supabase
      .from('league_rules')
      .insert({
         keepers_enabled: keepers_enabled,
         number_of_rounds: number_of_rounds,
         number_of_teams: number_of_teams,
         draft_style: draft_style,
         draft_picks: draft_picks,
      })
      .select();

   if (user && leagueId) {
      const owner = user.id;
      const { data, error } = await supabase
         .from('leagues')
         .insert({
            league_id: leagueId,
            league_name: leagueName,
            owner: owner,
            league_rules: league_rules?.data?.[0].id,
            league_scoring: league_scoring?.data?.[0].id,
         })
         .select();
      if (error) return;
      // for (let i = 1; i <= number_of_teams; i++) {
      //    await supabase
      //       .from('teams')
      //       .insert({ team_name: `Team ${i}`, league_id: leagueId });
      // }
      await supabase.from('draft').insert({ league_id: leagueId });
      redirect(`/leagues/${data?.[0].league_id}`);
   }
};

export default createLeague;
