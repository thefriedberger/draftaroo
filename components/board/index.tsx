import { BoardProps } from '@/lib/types';
import PlayerList from '../player-list';
import Timer from '../timer';

const Board = (props: BoardProps) => {
   const { timer, leagueID } = props;
   return (
      <div className="w-full">
         <Timer {...timer} />
         <PlayerList {...props} />
      </div>
   );
};
export default Board;
