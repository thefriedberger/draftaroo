import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
   const { leagueId, leagueName, owner, rules, scoring } = await request.json();

   const supabase = createRouteHandlerClient<Database>({ cookies });

   const { data, error } = await supabase
      .from('leagues')
      .insert([
         {
            league_id: leagueId,
            league_name: leagueName,
            owner: owner,
            league_rules: rules,
            league_scoring: scoring,
         },
      ])
      .select();
   if (error) return NextResponse.json(error);

   return NextResponse.json(data);
}
