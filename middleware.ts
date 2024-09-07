import { type NextRequest } from 'next/server';
import { updateSession } from './app/utils/supabase/middleware';

export async function middleware(req: NextRequest) {
   return await updateSession(req);
   // const res = NextResponse.next();
   // const supabase = createMiddlewareClient<Database>({ req, res });
   // await supabase.auth.getSession();
   // await updateSession(req);
   // return res;
}

export const config = {
   matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * Feel free to modify this pattern to include more paths.
       */
      '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
   ],
};
