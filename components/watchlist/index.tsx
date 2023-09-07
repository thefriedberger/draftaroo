import { useContext } from 'react';
import { PageContext } from '../context/page-context';

const Watchlist = () => {
   const { watchlist, updateWatchlist } = useContext(PageContext);
   return (
      <>
         <h3>Watchlist</h3>
      </>
   );
};

export default Watchlist;
