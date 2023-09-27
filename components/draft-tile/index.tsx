import { DraftTileProps } from '@/lib/types';
import classNames from 'classnames';

const DraftTile = ({ pick, currentPick }: DraftTileProps) => {
   return (
      <div
         className={classNames(
            currentPick === pick.draftPosition && 'bg-purple',
            pick.yourPick &&
               currentPick !== pick.draftPosition &&
               'dark:bg-gray-light',
            'flex flex-row border-b border-gray-300 p-1 text-black dark:text-white'
         )}
         tabIndex={1}
      >
         <span className={'border-r border-gray-300 p-1 pr-2 self-center'}>
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
