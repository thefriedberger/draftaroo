'use client';

import { useEffect, useState } from 'react';
import Loader from '../ui/loader';
import DraftOrderSkeleton from './draft-order-skeleton';
import MyTeamSkeleton from './my-team-skeleton';
import PlayerListSkeleton from './player-list-skeleton';
import TimerSkeleton from './timer-skeleton';
import WatchlistSkeleton from './watchlist-skeleton';

const BoardSkeleton = () => {
   const [isMobile, setIsMobile] = useState<boolean>();
   useEffect(() => {
      setIsMobile(window.innerWidth < 1024);
   }, []);

   return isMobile !== undefined ? (
      <div className="flex flex-col lg:flex-row items-center w-full overflow-y-hidden lg:overflow-y-hidden draft-board">
         {!isMobile ? (
            <>
               <div className="flex flex-col lg:max-w-[15vw] h-full w-full overflow-y-hidden">
                  <TimerSkeleton />
                  <DraftOrderSkeleton />
               </div>
               <div className="flex flex-col lg:max-w-[70vw] h-full w-full">
                  <div className="lg:min-h-[35%]"></div>
                  <div className="flex flex-row bg-emerald-primary w-52 min-h-[48px]">
                     <div className="flex items-center w-[50%] h-[48px] p-4">
                        <div className="w-full h-full bg-white rounded-md animate-pulse"></div>
                     </div>
                     <div className="flex items-center w-[50%] h-[48px] p-4">
                        <div className="w-full h-full bg-white rounded-md animate-pulse"></div>
                     </div>
                  </div>
                  <PlayerListSkeleton />
               </div>
               <div className="flex flex-col lg:max-w-[15vw] h-full w-full">
                  <WatchlistSkeleton />
                  <MyTeamSkeleton />
               </div>
            </>
         ) : (
            <>
               <TimerSkeleton />
               <PlayerListSkeleton />
               <div className="fixed bottom-0 h-[66px] w-full bg-emerald-primary grid grid-cols-5">
                  <div className="m-3 bg-white animate-pulse rounded-md"></div>
                  <div className="m-3 bg-white animate-pulse rounded-md"></div>
                  <div className="m-3 bg-white animate-pulse rounded-md"></div>
                  <div className="m-3 bg-white animate-pulse rounded-md"></div>
                  <div className="m-3 bg-white animate-pulse rounded-md"></div>
               </div>
            </>
         )}
      </div>
   ) : (
      <Loader text={'draft'} />
   );
};

export default BoardSkeleton;
