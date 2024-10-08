import KeeperIcon from '@/app/assets/images/icons/keeper-icon';
import { DraftContext } from '@/components/context/draft-context';
import { DraftTileProps } from '@/lib/types';
import classNames from 'classnames';
import { useContext, useEffect, useRef } from 'react';

const DraftTile = ({ pick, currentPick }: DraftTileProps) => {
   const { updateFeaturedPlayer } = useContext(DraftContext);
   const draftTileRef = useRef<HTMLDivElement | null>(null);
   const shouldScroll = useRef<boolean>(true);

   const scrollCallback = () => {
      const draftOrderContainer: HTMLDivElement = draftTileRef.current
         ?.parentElement?.parentElement as HTMLDivElement;

      draftOrderContainer.addEventListener('scroll', () => {
         shouldScroll.current = false;
      });
      shouldScroll.current = true;
      if (
         draftOrderContainer &&
         draftTileRef.current?.offsetTop &&
         shouldScroll.current === true
      ) {
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
      pick.playerID && updateFeaturedPlayer?.(null, pick.playerID);
   };
   return (
      <div
         className={classNames(
            currentPick === pick.draftPosition && 'bg-fuscia-primary',
            pick.yourPick &&
               currentPick !== pick.draftPosition &&
               'bg-paper-primary dark:bg-gray-light',
            pick.playerID && ' cursor-pointer',
            'flex flex-row border-b dark:border-gray-300 p-1 text-black dark:text-white'
         )}
         ref={(currentPick === pick.draftPosition && draftTileRef) || null}
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
            {pick.isKeeper && <KeeperIcon />}
         </div>
      </div>
   );
};

export default DraftTile;
