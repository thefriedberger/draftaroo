import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
   const { id, has_drafted } = await request.json();

   const supabase = createRouteHandlerClient<Database>({ cookies });
   const { data } = await supabase
      .from('teams')
      .update([{ has_drafted: !has_drafted }])
      .match({ id });
   return NextResponse.json(data);
}
