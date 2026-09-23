const Gamelog = (player: Player) => {
   const statsOrder = [
      'gameDate',
      'homeRoadFlag',
      'opponentAbbrev',
      'goals',
      'assists',
      'points',
      'plusMinus',
      'shots',
      'hits',
      'pim',
      'toi',
      'powerPlayGoals',
      'powerPlayPoints',
      'shorthandedGoals',
      'shorthandedPoints',
   ];
   const statsOrderGoalie = [
      'gameDate',
      'homeRoadFlag',
      'opponentAbbrev',
      'gamesStarted',
      'decision',
      'goalsAgainst',
      'shotsAgainst',
      'hits',
      'toi',
   ];
   const statsMap = {
      'Game Date': 'Date',
      'Home Road Flag': '@',
      'Opponent Abbrev': 'Opp.',
      'Goals Against': 'GA',
      Decision: 'Res.',
      'Games Started': 'GS',
      'Shots Against': 'SA',
      Goals: 'G',
      Assists: 'A',
      Points: 'P',
      'Plus Minus': '+/-',
      Shots: 'S',
      Hits: 'H',
      Pim: 'PIM',
      Toi: 'TOI',
      'Power Play Goals': 'PPG',
      'Power Play Points': 'PPP',
      'Shorthanded Goals': 'SHG',
      'Shorthanded Points': 'SHP',
   };
   const { gamelog } = player;
   if (!gamelog) return null;

   const seasonCode = Object.keys(gamelog)[0];
   const season = `${seasonCode.substring(0, 4)}-${seasonCode.substring(5)}`;
   const tableHeaders = gamelog[seasonCode].map((game) => {
      const stats = Object.keys(game)
         .filter((key) =>
            player.primary_position === 'G'
               ? statsOrderGoalie.includes(key)
               : statsOrder.includes(key)
         )
         .sort(
            (a, b) =>
               (player.primary_position === 'G'
                  ? statsOrderGoalie
                  : statsOrder
               ).indexOf(a) -
               (player.primary_position === 'G'
                  ? statsOrderGoalie
                  : statsOrder
               ).indexOf(b)
         );

      //  return stats;
      return stats.map((stat) => {
         stat = `${stat.charAt(0).toLocaleUpperCase()}${stat.substring(1)}`;
         const formattedStat = stat.split(/(?=[A-Z])/).join(' ');
         return statsMap[formattedStat];
      });
   })[0];

   const statsKeys = gamelog[seasonCode].map((game) => {
      const stats = Object.keys(game)
         .filter((key) =>
            player.primary_position === 'G'
               ? statsOrderGoalie.includes(key)
               : statsOrder.includes(key)
         )
         .sort(
            (a, b) =>
               (player.primary_position === 'G'
                  ? statsOrderGoalie
                  : statsOrder
               ).indexOf(a) -
               (player.primary_position === 'G'
                  ? statsOrderGoalie
                  : statsOrder
               ).indexOf(b)
         );

      return stats;
   })[0];

   const formattedStats: Record<any, any>[] = [];
   for (const season of gamelog[seasonCode].reverse()) {
      const gameStats: Record<any, any>[] = [];
      for (const key of statsKeys) {
         gameStats.push(season[key]);
      }
      formattedStats.push(gameStats);
   }

   return (
      <>
         <table className="mt-2 lg:max-w-[80vw] block overflow-scroll lg:max-h-[25vh]">
            <tr className="bg-gold text-white">
               {tableHeaders.map((header) => (
                  <th key={header} className="min-w-8 text-sm text-left">
                     {header}
                  </th>
               ))}
            </tr>
            {formattedStats.map((stats, i) => (
               <tr key={i}>
                  {stats.map((stat, i) => (
                     <td key={`${stat}-${i}`} className="text-sm">
                        {stat}
                     </td>
                  ))}
               </tr>
            ))}
         </table>
      </>
   );
};
export default Gamelog;
