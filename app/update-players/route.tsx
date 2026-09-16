import updatePlayers from '../utils/fetch-players';

export const maxDuration = 60; // Set timeout to 60 seconds

export async function POST() {
   try {
      await updatePlayers();
   } catch (error) {
      console.error('Update players error: ', error);
      return;
   }
   console.info('All good');
}
