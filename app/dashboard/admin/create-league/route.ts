import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
   const { leagueName, owner, leagueRules, leagueStats } = await request.json();

   const supabase = createRouteHandlerClient<Database>({ cookies });
   const { data } = await supabase.from('leagues').insert({
      league_name: leagueName,
      owner: owner,
      league_rules: leagueRules,
      league_stats: leagueStats,
   });
   return NextResponse.json(data);
}
