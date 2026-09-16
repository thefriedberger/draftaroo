import fetchWithRetry from './fetch-with-retry';
import { createClient } from './supabase/server';

const getDoB = async () => {
   const supabase = createClient();
   const { data } = await supabase.from('players').select('id');

   if (!data) return;
   for (const id of data) {
      const response = await fetchWithRetry(
         `https://api-web.nhle.com/v1/player/${id.id}/landing`
      );
      const parsedResponse = await response.json();

      if (!parsedResponse?.birthDate) continue;

      const { data, error } = await supabase
         .from('players')
         .update({ dob: new Date(parsedResponse?.birthDate) })
         .match({ id: id.id });
   }
};

export default getDoB;
