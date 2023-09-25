'use client';

import { WatchlistProps } from '@/lib/types';
import { useContext } from 'react';
import { PageContext } from '../context/page-context';
import WatchlistStar from './watchlist-star';

const Watchlist = ({ updateFeaturedPlayer, draftedIDs }: WatchlistProps) => {
   const { watchlist } = useContext(PageContext);

   const handleUpdateFeaturedPlayer = (player: Player, e: any) => {
      const target: HTMLElement = e.target;
      !['svg', 'path'].includes(target.localName) &&
         updateFeaturedPlayer(player);
   };
   return (
      <div className="lg:min-h-[25vh] lg:max-h-[25vh] overflow-y-scroll px-1">
         <h3 className="text-xl font-bold">Watchlist</h3>
         {watchlist
            .filter((player: Player) => !draftedIDs.includes(player.id))
            .map((player: Player) => {
               return (
                  <div
                     key={player.id}
                     className="flex flex-row items-center"
                     onClick={(e) => handleUpdateFeaturedPlayer(player, e)}
                  >
                     <div className="fill-emerald-500 w-[30px] flex items-center">
                        <WatchlistStar player={player} />
                     </div>
                     <p className="ml-2">
                        {player.first_name} {player.last_name}
                     </p>
                  </div>
               );
            })}
      </div>
   );
};

export default Watchlist;
