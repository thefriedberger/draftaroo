import { NextResponse } from 'next/server';

export async function GET(request: Request) {
   const requestUrl = new URL(request.url);
   const email = requestUrl.searchParams.get('email');

   return NextResponse.redirect(
      `${requestUrl.origin}/auth/sign-up${email && `?email=${email}`}`
   );
}
