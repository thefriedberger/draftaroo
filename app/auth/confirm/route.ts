import { NextRequest, NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/app/utils/supabase/server';

export async function GET(request: NextRequest) {
   const requestUrl = new URL(request.url);
   const code = requestUrl.searchParams.get('code');

   if (code) {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
         return NextResponse.redirect(`${requestUrl.origin}/`);
      }
   }
   return NextResponse.redirect(`${requestUrl.origin}/error`);
}
