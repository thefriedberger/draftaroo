import getGamelogs from '../utils/get-gamelogs';

export const maxDuration = 60;

export async function POST() {
   try {
      await getGamelogs();
   } catch (error) {
      console.error('Update players error: ', error);
      return;
   }
   console.info('All good');
}
