import { DraftTileProps } from '@/lib/types';

const DraftTile = ({ pick, currentPick, playerSelected }: DraftTileProps) => {
   return (
      <div className="flex flex-row">
         <span>{pick.draftPosition}</span>
         <div className="flex flex-col ml-1">
            <p>{pick.username}</p>
            {pick.playerName && <p>{pick.playerName}</p>}
         </div>
      </div>
   );
};

export default DraftTile;
