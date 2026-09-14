import KeeperIcon from '@/app/assets/images/icons/keeper-icon';
import { DraftContext } from '@/components/context/draft-context';
import { DraftTileProps } from '@/lib/types';
import classNames from 'classnames';
import { useContext, useEffect, useRef } from 'react';

const DraftTile = ({ pick, currentPick, player }: DraftTileProps) => {
   const { updateFeaturedPlayer } = useContext(DraftContext);
   const draftTileRef = useRef<HTMLDivElement | null>(null);
   const shouldScroll = useRef<boolean>(true);
   const tileColorMap: Record<'F' | 'C' | 'L' | 'R' | 'D' | 'G', string> = {
      F: 'bg-blue-300',
      C: 'bg-blue-300',
      L: 'bg-blue-300',
      R: 'bg-blue-300',
      D: 'bg-orange-300',
      G: 'bg-green-300',
   };

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
            currentPick === pick.draftPosition &&
               'ring-2 ring-emerald-primary ring-inset',
            pick.playerID && ' cursor-pointer',
            'flex flex-row p-1 text-black rounded-md',
            !player && 'dark:text-white dark:bg-gray-light',
            player && tileColorMap[player.primary_position ?? 'C']
         )}
         ref={(currentPick === pick.draftPosition && draftTileRef) || null}
         onClick={handleUpdateFeaturedPlayer}
      >
         <div className="w-full max-w-[60%] h-20">
            <div className={`${pick.isKeeper ? 'col-span-3' : 'col-span-4'}`}>
               {pick.playerName && <p>{pick.playerName}</p>}
            </div>
         </div>
         <div className="flex flex-col ml-auto">
            <span
               className={
                  'h-8 w-8 min-w-8 max-h-8 max-w-8 flex items-center justify-center top-0 left-0 rounded-full text-white bg-gold mb-auto'
               }
            >
               {pick.draftPosition}
            </span>
            {pick.isKeeper && <KeeperIcon />}
         </div>
      </div>
   );
};

export default DraftTile;
