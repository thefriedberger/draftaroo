import { DraftTileProps } from '@/lib/types';
import classNames from 'classnames';

const DraftTile = ({ pick, currentPick }: DraftTileProps) => {
   return (
      <div
         className={classNames(
            currentPick === pick.draftPosition && 'bg-fuscia',
            pick.yourPick &&
               currentPick !== pick.draftPosition &&
               'bg-paper-light dark:bg-gray-light',
            'flex flex-row border-b border-paper-dark dark:border-gray-300 p-1 text-black dark:text-white'
         )}
         autoFocus={currentPick === pick.draftPosition}
      >
         <span
            className={
               'border-r border-paper-dark dark:border-gray-300 p-1 pr-2 self-center'
            }
         >
            {pick.draftPosition}
         </span>
         <div className="flex flex-col pl-2 self-center">
            <p>{pick.username}</p>
            {pick.playerName && <p>{pick.playerName}</p>}
         </div>
      </div>
   );
};

export default DraftTile;
