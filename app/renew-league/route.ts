import { createDraft } from '../utils/create-draft';
import { createClient } from '../utils/supabase/server';

export async function POST(request: Request) {
   const { league_id } = await request?.json();

   if (!league_id) {
      return new Response('No league id provided', { status: 500 });
   }

   const supabase = createClient();

   try {
      const response = await createDraft({
         supabase,
         params: { id: league_id },
      });
   } catch (error) {
      return Response.error();
   }
   return new Response('Successfully created new draft!', { status: 200 });
}
