import KeeperIcon from '@/app/assets/images/icons/keeper-icon';
import { tileColorMap } from '@/app/utils/constants';
import { DraftContext } from '@/components/context/draft-context';
import { DraftTileProps } from '@/lib/types';
import classNames from 'classnames';
import Image from 'next/image';
import { useContext, useEffect, useRef } from 'react';

const DraftTile = ({
   pick,
   currentPick,
   player,
   className,
}: DraftTileProps) => {
   const { updateFeaturedPlayer } = useContext(DraftContext);
   const draftTileRef = useRef<HTMLDivElement | null>(null);
   const shouldScroll = useRef<boolean>(true);

   useEffect(() => {
      const scrollCallback = () => {
         const draftOrderContainer: HTMLDivElement = draftTileRef.current
            ?.parentElement?.parentElement as HTMLDivElement;

         draftOrderContainer.addEventListener('scroll', () => {
            shouldScroll.current = false;
         });

         shouldScroll.current = true;
         if (
            draftOrderContainer &&
            draftTileRef.current &&
            shouldScroll.current === true
         ) {
            draftTileRef.current.scrollIntoView({ behavior: 'smooth' });
         }
      };

      currentPick === pick.draftPosition && scrollCallback();
      return () => {};
   }, [pick, currentPick]);

   const handleUpdateFeaturedPlayer = () => {
      pick.playerID && updateFeaturedPlayer?.(null, pick.playerID);
   };

   return (
      <div
         className={classNames(
            className,
            'ring-2 ring-inset ring-[rgba(0,0,0,.25)]',
            currentPick === pick.draftPosition && '!ring-emerald-primary',
            pick.playerID && ' cursor-pointer',
            'flex flex-col text-black rounded-md h-24 relative z-10',
            !player && 'dark:text-white dark:bg-gray-light',
            pick.yourPick &&
               currentPick !== pick.draftPosition &&
               ' ring-gray-dark dark:ring-fuscia-primary',
            player && tileColorMap[player.primary_position ?? 'C']
         )}
         tabIndex={0}
         ref={(currentPick === pick.draftPosition && draftTileRef) || null}
         onClick={handleUpdateFeaturedPlayer}
         onKeyDown={(e) => e.code === 'Enter' && handleUpdateFeaturedPlayer()}
         data-featured-toggle={true}
      >
         <div className="flex justify-between bg-[rgba(0,0,0,.25)] rounded-t-[4px] h-[calc(fit-content-2px)] mt-[2px] w-[calc(100%-4px)] ml-[2px] px-1 pr-0">
            <span className={'dark:text-white font-medium'}>
               {pick.draftPosition}
            </span>
            <span className="flex items-center">
               {pick.isKeeper && <KeeperIcon />}
            </span>
         </div>
         <div className="block w-full p-1 text-sm overflow-hidden whitespace-nowrap text-ellipsis">
            {pick.playerName && pick.playerName}
         </div>
         {player && (
            <Image
               src={player?.headshot || ''}
               width={35}
               height={35}
               alt={`Headshot of ${player.first_name} ${player.last_name}`}
               className="rounded-full bg-[rgba(0,0,0,.5)] absolute left-1 bottom-1"
            />
         )}
      </div>
   );
};

export default DraftTile;
