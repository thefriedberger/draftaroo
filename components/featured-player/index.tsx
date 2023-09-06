const FeaturedPlayer = ({
   featuredPlayer,
}: {
   featuredPlayer: Player | null;
}) => {
   return (
      <div className="featured-player">
         {featuredPlayer && (
            <div>
               <p className="dark:text-white">{featuredPlayer?.first_name}</p>
            </div>
         )}
      </div>
   );
};

export default FeaturedPlayer;
