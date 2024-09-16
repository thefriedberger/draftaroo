'use client';

import { DraftContext } from '@/components/context/draft-context';
import { WatchlistProps } from '@/lib/types';
import { useContext, useEffect, useRef, useState } from 'react';
import WatchlistStar from './watchlist-star';

const Watchlist = ({ draftedIDs, players }: WatchlistProps) => {
   const { watchlist, updateFeaturedPlayer, updateWatchlist } =
      useContext(DraftContext);
   const [watchlistPlayers, setWatchlistPlayers] = useState<Player[]>(
      players?.filter(
         (player: Player) =>
            !draftedIDs.includes(player.id) && watchlist.includes(player.id)
      ) ?? []
   );

   useEffect(() => {
      if (players && watchlist) {
         const updatedWatchlist: Player[] = [];
         for (let i = 0; i < watchlist.length; i++) {
            const newPlayer = players.find(
               (player) => player.id === watchlist[i]
            );
            if (newPlayer) updatedWatchlist.push(newPlayer);
         }
         setWatchlistPlayers(updatedWatchlist);
      }
   }, [watchlist, players]);

   const handleUpdateFeaturedPlayer = (player: Player, e: any) => {
      const target = e.target;
      !['svg', 'path', 'form', 'input'].includes(target.localName) &&
         updateFeaturedPlayer?.(player);
   };

   return (
      <div className=" lg:min-h-[35%] lg:max-h-full overflow-y-scroll px-1 text-black dark:text-white">
         <h3 className="hidden lg:block text-xl font-bold">Watchlist</h3>
         {watchlistPlayers.length > 0 ? (
            watchlistPlayers
               .filter((player: Player) => !draftedIDs.includes(player.id))
               .map((player: Player, index: number) => {
                  const props = {
                     player,
                     handleUpdateFeaturedPlayer,
                     watchlistPlayers,
                  };
                  return <WatchlistPlayer key={player.id} {...props} />;
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

const WatchlistPlayer = ({
   player,
   handleUpdateFeaturedPlayer,
   watchlistPlayers,
}: {
   player: Player;
   handleUpdateFeaturedPlayer: (player: Player, e: any) => void;
   watchlistPlayers: Player[];
}) => {
   const { reorderWatchlist } = useContext(DraftContext);
   const watchlistPosition = useRef<number>();
   const inputRef = useRef<HTMLInputElement>(null);
   const handleReorderWatchlist = () => {
      if (!watchlistPosition.current) {
         return;
      }

      const playerIndex = watchlistPlayers.findIndex(
         (toFind) => player.id === toFind.id
      );
      let reorderedWatchlist = watchlistPlayers.filter(
         (toFind) => toFind.id !== player.id
      );
      reorderedWatchlist.splice(watchlistPosition.current - 1, 0, player);

      reorderWatchlist?.(reorderedWatchlist.map((player) => player.id));
      if (inputRef.current) {
         inputRef.current.value = '';
      }
   };
   return (
      <div
         key={player.id}
         className="flex flex-row items-center cursor-pointer"
         onClick={(e) => handleUpdateFeaturedPlayer(player, e)}
      >
         <div className="fill-emerald-500 w-[30px] flex items-center">
            <WatchlistStar player={player} />
         </div>
         <p className="ml-2 pt-1">
            {player.first_name} {player.last_name}
         </p>
         <form action={handleReorderWatchlist} className="w-5 ml-auto">
            <input
               type="number"
               max={watchlistPlayers.length}
               min={0}
               ref={inputRef}
               className="w-full rounded-sm text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
               onChange={(e) => {
                  watchlistPosition.current = Number(e.target.value);
               }}
            />
         </form>
      </div>
   );
};
