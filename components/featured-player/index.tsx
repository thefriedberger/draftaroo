'use client';

import classNames from 'classnames';
import { useContext } from 'react';
import { PageContext } from '../context/page-context';
import { teamAbreviations } from '../player';
import WatchlistStar, { WatchlistStarProps } from '../watchlist/watchlist-star';

const FeaturedPlayer = ({
   featuredPlayer,
   yourTurn,
   handleDraftSelection,
   draftedPlayers,
}: {
   featuredPlayer: Player | null;
   yourTurn: boolean;
   handleDraftSelection: (player: Player) => void;
   draftedPlayers: number[];
}) => {
   const { watchlist } = useContext(PageContext);
   const watchlistStarProps: WatchlistStarProps = {
      player: featuredPlayer as Player,
      isButton: true,
      className:
         'flex flex-row bg-gray-primary text-white fill-emerald-700 p-2 rounded-md',
   };

   return (
      <div className="md:h-[15vh]">
         {featuredPlayer && !draftedPlayers.includes(featuredPlayer.id) ? (
            <>
               <div className="dark:text-white text-xl">
                  {featuredPlayer.first_name} {featuredPlayer.last_name}
                  &nbsp;&nbsp;&nbsp;
                  <span className="dark:text-gray-300 text-sm leading-3">
                     {teamAbreviations?.[featuredPlayer.current_team] || 'FA'} -{' '}
                     {featuredPlayer.primary_position &&
                        featuredPlayer.primary_position
                           .split(' ')
                           .map((char: string) => char[0])}
                  </span>
               </div>
               <div className="flex flex-row h-10">
                  <button
                     className={classNames(
                        'bg-fuscia p-2 rounded-md md:mr-2 disabled:cursor-not-allowed',
                        !yourTurn && 'opacity-50'
                     )}
                     onClick={() => {
                        handleDraftSelection(featuredPlayer);
                     }}
                     type="button"
                     disabled={!yourTurn}
                  >
                     Draft{' '}
                     {featuredPlayer.first_name
                        .split(' ')
                        .map((char: string) => char[0])}
                     {'. '}
                     {featuredPlayer.last_name}
                  </button>
                  <WatchlistStar {...watchlistStarProps} />
               </div>
               <p>{yourTurn}</p>
            </>
         ) : (
            <>
               <p>Your turn in {yourTurn}</p>
            </>
         )}
      </div>
   );
};

export default FeaturedPlayer;
