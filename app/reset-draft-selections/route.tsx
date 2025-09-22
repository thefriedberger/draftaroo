import { createClient } from '../utils/supabase/server';

export async function POST(request: Request) {
   const { draft_id } = await request?.json();

   if (!draft_id) {
      return new Response('No draft id provided', { status: 500 });
   }

   const supabase = createClient();

   try {
      const response = await supabase
         .from('draft_selections')
         .delete()
         .match({ draft_id: draft_id, is_keeper: false })
         .select('*')
         .then(
            async () =>
               await supabase
                  .from('draft')
                  .update({ current_pick: 1 })
                  .match({ id: draft_id })
         );
   } catch (error) {
      return Response.error();
   }
   return new Response('Successfully reset draft!', { status: 200 });
}
