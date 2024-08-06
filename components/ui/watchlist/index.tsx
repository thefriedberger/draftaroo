'use client';

import { WatchlistProps } from '@/lib/types';
import getPlayers from '@/utils/get-players';
import { useContext, useEffect, useState } from 'react';
import { PageContext } from '../context/page-context';
import WatchlistStar from './watchlist-star';

const Watchlist = ({
   updateFeaturedPlayer,
   draftedIDs,
   leagueID,
}: WatchlistProps) => {
   const { watchlist } = useContext(PageContext);
   const [players, setPlayers] = useState<Player[]>([]);
   const [watchlistPlayers, setWatchlistPlayers] = useState<Player[]>([]);

   useEffect(() => {
      const fetchPlayers = async () => {
         const data = await getPlayers(leagueID);
         data && setPlayers(data as Player[]);
      };
      fetchPlayers();
   }, [leagueID]);

   useEffect(() => {
      if (players) {
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
      <div className=" lg:h-[30%] overflow-y-scroll px-1 text-black dark:text-white">
         <h3 className="hidden lg:block text-xl font-bold">Watchlist</h3>
         {watchlistPlayers.length > 0 &&
            watchlistPlayers
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
                        <p className="ml-2 pt-1">
                           {player.first_name} {player.last_name}
                        </p>
                     </div>
                  );
               })}
      </div>
   );
};

export default Watchlist;
