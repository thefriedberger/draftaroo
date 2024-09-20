import KeeperSkeleton from '@/components/skeletons/keeper-skeleton';

export default function KeeperLoading() {
   return (
      <div className="lg:max-w-2xl w-full lg:px-5">
         <KeeperSkeleton />
      </div>
   );
}
