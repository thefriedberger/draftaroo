'use client';

import { WatchlistProps } from '@/lib/types';
import { useEffect, useState } from 'react';
import WatchlistStar from './watchlist-star';

const Watchlist = ({
   updateFeaturedPlayer,
   draftedIDs,
   watchlist,
   updateWatchlist,
   players,
}: WatchlistProps) => {
   const [watchlistPlayers, setWatchlistPlayers] = useState<Player[]>(
      players?.filter((player: Player) => watchlist.includes(player.id)) ?? []
   );

   // test comment

   useEffect(() => {
      if (players && watchlist && watchlist?.length) {
         setWatchlistPlayers(
            players.filter((player: Player) => watchlist.includes(player.id))
         );
      }
   }, [watchlist, players]);

   const handleUpdateFeaturedPlayer = (player: Player, e: any) => {
      const target: HTMLElement = e.target;
      !['svg', 'path'].includes(target.localName) &&
         updateFeaturedPlayer(player);
   };
   return (
      <div className=" lg:min-h-[35%] lg:max-h-full overflow-y-scroll px-1 text-black dark:text-white">
         <h3 className="hidden lg:block text-xl font-bold">Watchlist</h3>
         {watchlistPlayers.length > 0 ? (
            watchlistPlayers
               .filter((player: Player) => !draftedIDs.includes(player.id))
               .map((player: Player) => {
                  return (
                     <div
                        key={player.id}
                        className="flex flex-row items-center cursor-pointer"
                        onClick={(e) => handleUpdateFeaturedPlayer(player, e)}
                     >
                        <div className="fill-emerald-500 w-[30px] flex items-center">
                           <WatchlistStar
                              watchlist={watchlist}
                              player={player}
                              updateWatchlist={updateWatchlist}
                           />
                        </div>
                        <p className="ml-2 pt-1">
                           {player.first_name} {player.last_name}
                        </p>
                     </div>
                  );
               })
         ) : (
            <h2 className="py-5 dark:text-white text-center text-xl">
               Your watchlist is empty
            </h2>
         )}
      </div>
   );
};

export default Watchlist;
