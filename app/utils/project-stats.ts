const projectStats = (player: Player) => {
   return Object.keys(player.stats ?? {})
      .filter((stats) => stats)
      .reduce((a, b, index) => {
         const numberOfSeasons = Object.keys(player?.stats || []).filter(
            (stats) => stats
         ).length;

         const statsA = a;
         const statsB = player?.stats?.[b];
         const keys = Object.keys(statsB || {});
         const projected = { stats: {} };
         if (player.id === 8484144) {
            // console.log(statsA, statsB);
         }
         for (const key of keys) {
            if (player.id === 8484144) {
               // console.log(key);
            }
            if (
               player?.stats
               //  &&
               // index === player?.stats - 1
            ) {
               if (
                  statsB?.[key] === 0 &&
                  (statsA?.[key] === 0 || !statsA?.[key])
               ) {
                  projected.stats[key] = 0;
               } else {
                  projected.stats[key] =
                     Math.round(
                        (Math.round((statsB[key] + (statsA?.[key] || 0)) * 10) /
                           10 /
                           numberOfSeasons || 3) * 10
                     ) / 10;
               }
            } else {
               if (numberOfSeasons === 1 && key !== 'games') {
                  projected.stats[key] =
                     (Math.round((statsB[key] + (statsA?.[key] || 0)) * 1.15) *
                        10) /
                     10;
               } else {
                  projected.stats[key] = statsB[key] + (statsA?.[key] || 0);
               }
            }
         }
         return projected;
      }, {});
};

export default projectStats;
