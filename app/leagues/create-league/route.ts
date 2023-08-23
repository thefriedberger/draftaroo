import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
   const { leagueId, leagueName, owner, rules, scoring } = await request.json();
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
      shots,
   } = scoring;
   const {
      keepers_enabled,
      number_of_rounds,
      number_of_teams,
      draft_style,
      draft_picks,
   } = rules;

   const supabase = createRouteHandlerClient<Database>({ cookies });

   const league_scoring = await supabase
      .from('leagues_scoring')
      .insert({
         goals: goals,
         assists: assists,
         powerplay_assists: powerplay_assists,
         powerplay_goals: powerplay_goals,
         powerplay_points: powerplay_points,
         plus_minus: plus_minus,
         shorthanded_assists: shorthanded_assists,
         shorthanded_goals: shorthanded_goals,
         shorthanded_points: shorthanded_points,
         hits: hits,
         blocks: blocks,
         shots: shots,
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

   console.log(league_rules, league_scoring);

   // const { data, error } = await supabase
   //    .from('leagues')
   //    .insert([
   //       {
   //          league_id: leagueId,
   //          league_name: leagueName,
   //          owner: owner,
   //          league_rules: league_rules,
   //          league_scoring: scoring,
   //       },
   //    ])
   //    .select();
   // if (error) return NextResponse.json({ error: error });

   return NextResponse.json({ league_rules, league_scoring });
}
