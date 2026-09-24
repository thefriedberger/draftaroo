'use client';
import DraftOrderSkeleton from './draft-order';
import MyTeamSkeleton from './my-team';
import PlayerListSkeleton from './player-list';
import TimerSkeleton from './timer';
import WatchlistSkeleton from './watchlist';

const BoardSkeleton = () => {
   return (
      <>
         <div className="hidden lg:flex flex-col min-h-64 lg:max-w-full h-full w-full overflow-y-hidden">
            <TimerSkeleton />
            <DraftOrderSkeleton />
         </div>
         <div className="hidden lg:flex lg:max-w-full h-full w-full">
            <div className="flex flex-col h-full max-w-[74%] min-w-[74%]">
               <div className="flex flex-row bg-emerald-primary w-52 min-h-[40px]">
                  <div className="flex items-center w-[50%] h-full p-4">
                     <div className="w-full h-full bg-white rounded-md animate-pulse"></div>
                  </div>
                  <div className="flex items-center w-[50%] h-full p-4">
                     <div className="w-full h-full bg-white rounded-md animate-pulse"></div>
                  </div>
               </div>
               <PlayerListSkeleton />
            </div>
            <div className="flex flex-col h-full w-full max-w-[25%] min-w-[25%]">
               <WatchlistSkeleton />
               <MyTeamSkeleton />
            </div>
         </div>
         <div className="flex flex-col lg:hidden w-full">
            <TimerSkeleton />
            <DraftOrderSkeleton />
            <PlayerListSkeleton />
            <div className="fixed bottom-0 h-[66px] w-full bg-emerald-primary grid grid-cols-5">
               <div className="m-3 bg-white animate-pulse rounded-md"></div>
               <div className="m-3 bg-white animate-pulse rounded-md"></div>
               <div className="m-3 bg-white animate-pulse rounded-md"></div>
               <div className="m-3 bg-white animate-pulse rounded-md"></div>
               <div className="m-3 bg-white animate-pulse rounded-md"></div>
            </div>
         </div>
      </>
   );
};

export default BoardSkeleton;
