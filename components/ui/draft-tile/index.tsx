import { DraftContext } from '@/components/context/draft-context';
import { DraftTileProps } from '@/lib/types';
import classNames from 'classnames';
import { useContext, useEffect, useRef } from 'react';

const DraftTile = ({ pick, currentPick }: DraftTileProps) => {
   const { updateFeaturedPlayer } = useContext(DraftContext);
   const draftTileRef = useRef<HTMLDivElement | null>(null);

   const scrollCallback = () => {
      // lol wut is this? JS written in 2015?
      const draftOrderContainer: HTMLDivElement | null | undefined =
         draftTileRef.current?.offsetParent?.querySelector('.draft-order');

      if (draftOrderContainer && draftTileRef.current?.offsetTop) {
         const scrollY =
            draftTileRef.current?.offsetTop -
            draftOrderContainer.offsetTop -
            40;
         draftOrderContainer.scrollTo({
            top: scrollY,
         });
      }
   };
   useEffect(() => {
      currentPick === pick.draftPosition && scrollCallback();
   }, [pick, currentPick]);

   const handleUpdateFeaturedPlayer = () => {
      updateFeaturedPlayer?.(null, pick.playerID);
   };
   return (
      <div
         className={classNames(
            currentPick === pick.draftPosition && 'bg-fuscia-primary',
            pick.yourPick &&
               currentPick !== pick.draftPosition &&
               'bg-paper-primary dark:bg-gray-light',
            'flex flex-row border-b dark:border-gray-300 p-1 cursor-pointer text-black dark:text-white'
         )}
         ref={draftTileRef}
         onClick={handleUpdateFeaturedPlayer}
      >
         <span
            className={
               'border-r border-paper-dark dark:border-gray-300 p-1 pr-2 self-center'
            }
         >
            {pick.draftPosition}
         </span>
         <div className="w-full grid grid-cols-4 pl-2 self-center">
            <div className={`${pick.isKeeper ? 'col-span-3' : 'col-span-4'}`}>
               <p className="grid items-center">{pick.username}</p>
               {pick.playerName && <p>{pick.playerName}</p>}
            </div>
            {pick.isKeeper && (
               <div className="flex items-center justify-center w-[20px] h-[20px] border border-white bg-blue-primary text-white font-bold text-[10px] text-center self-center ml-auto">
                  K
               </div>
            )}
         </div>
      </div>
   );
};

export default DraftTile;
