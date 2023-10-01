import { DraftTileProps } from '@/lib/types';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';

const DraftTile = ({ pick, currentPick }: DraftTileProps) => {
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
   return (
      <div
         className={classNames(
            currentPick === pick.draftPosition && 'bg-fuscia',
            pick.yourPick &&
               currentPick !== pick.draftPosition &&
               'bg-paper-light dark:bg-gray-light',
            'flex flex-row border-b border-paper-dark dark:border-gray-300 p-1 text-black dark:text-white'
         )}
         ref={draftTileRef}
      >
         <span
            className={
               'border-r border-paper-dark dark:border-gray-300 p-1 pr-2 self-center'
            }
         >
            {pick.draftPosition}
         </span>
         <div className="flex flex-col pl-2 self-center">
            <p>{pick.username}</p>
            {pick.playerName && <p>{pick.playerName}</p>}
         </div>
      </div>
   );
};

export default DraftTile;
