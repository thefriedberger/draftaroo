import fetchWithRetry from './fetch-with-retry';
import { createClient } from './supabase/server';

const getGamelogs = async () => {
   const supabase = createClient();
   const { data } = await supabase.from('players').select('id');

   const seasonCode = `${
      new Date().getFullYear() - 1
   }${new Date().getFullYear()}`;
   if (!data) return;
   for (const id of data) {
      const response = await fetchWithRetry(
         `https://api-web.nhle.com/v1/player/${id.id}/game-log/${seasonCode}/2`
      );
      const parsedResponse = await response.json();

      if (!parsedResponse?.gameLog?.length) continue;

      const { data, error } = await supabase
         .from('players')
         .update({ gamelog: { [seasonCode]: parsedResponse?.gameLog } })
         .match({ id: id.id });
   }
};

export default getGamelogs;
