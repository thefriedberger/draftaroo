'use client';

import { BoardProps } from '@/lib/types';
import classNames from 'classnames';
import { useState } from 'react';
import DraftOrder from '../draft-order';
import FeaturedPlayer from '../featured-player';
import MyTeam from '../my-team';
import PlayerList from '../player-list';
import Timer from '../timer';
import Watchlist from '../watchlist';

const Board = (props: BoardProps) => {
   const { timer, leagueID } = props;
   const [featuredPlayer, setFeaturedPlayer] = useState<Player>();
   const updateFeaturedPlayer = (player: Player) => {
      setFeaturedPlayer(player);
   };

   return (
      <div className={classNames('w-full flex flex-row')}>
         <div className="flex flex-col lg:max-w-[15vw] w-full">
            <Timer {...timer} />
            <DraftOrder />
         </div>
         <div className="flex flex-col lg:max-w-[70vw] w-full">
            <FeaturedPlayer featuredPlayer={featuredPlayer || null} />
            <PlayerList
               leagueID={leagueID}
               updateFeaturedPlayer={updateFeaturedPlayer}
            />
         </div>
         <div className="flex flex-col lg:max-w-[15vw] w-full">
            <Watchlist updateFeaturedPlayer={updateFeaturedPlayer} />
            <MyTeam />
         </div>
      </div>
   );
};
export default Board;
``;
