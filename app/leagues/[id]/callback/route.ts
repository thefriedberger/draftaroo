import { NextResponse } from 'next/server';

export async function GET(request: Request) {
   const requestUrl = new URL(request.url);
   const leagueID = requestUrl.searchParams.get('leagueID');

   return NextResponse.redirect(
      `${requestUrl.origin}/update-account?leagueID=${leagueID}`
   );
}
