'use client';

import { useContext, useEffect } from 'react';
import { PageContext } from '../context/page-context';
import WatchlistStar from './watchlist-star';

const Watchlist = ({
   updateFeaturedPlayer,
   draftedPlayers,
}: {
   updateFeaturedPlayer: (player: Player | any) => void;
   draftedPlayers: number[];
}) => {
   const { watchlist } = useContext(PageContext);
   useEffect(() => {}, [watchlist]);
   const handleUpdateFeaturedPlayer = (player: Player, e: any) => {
      const target: HTMLElement = e.target;
      !['svg', 'path'].includes(target.localName) &&
         updateFeaturedPlayer(player);
   };
   return (
      <>
         <h3 className="text-xl font-bold">Watchlist</h3>
         {watchlist
            .filter((player: Player) => !draftedPlayers.includes(player.id))
            .map((player: Player) => {
               return (
                  <div
                     key={player.id}
                     className="flex flex-row "
                     onClick={(e) => handleUpdateFeaturedPlayer(player, e)}
                  >
                     <div className="fill-emerald-500 w-[20px] flex items-center mr-1">
                        <WatchlistStar player={player} />
                     </div>
                     <p>
                        {player.first_name} {player.last_name}
                     </p>
                  </div>
               );
            })}
      </>
   );
};

export default Watchlist;
