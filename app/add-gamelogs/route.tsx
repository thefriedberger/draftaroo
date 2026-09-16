import getGamelogs from '../utils/get-gamelogs';

export const maxDuration = 60;

export async function POST() {
   try {
      await getGamelogs();
   } catch (error) {
      console.error('Update gamelogs error: ', error);
      return;
   }
   console.info('Gamelogs updated/added');
}
