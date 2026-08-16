import updatePlayers from '../utils/fetch-players';

export async function POST() {
   try {
      await updatePlayers();
   } catch (error) {
      console.error('Update players error: ', error);
      return;
   }
   console.info('All good');
}
