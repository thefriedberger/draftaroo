import updatePlayers from '../utils/fetch-players';

export async function POST() {
   try {
      await updatePlayers();
   } catch (error) {
      console.log('Update players error: ', error);
      return;
   }
   console.log('All good');
}
