const projectStats = (player: Player) => {
   const currentYear = new Date().getUTCFullYear();
   const projectedYear = `${currentYear}${currentYear + 1} (proj.)`;

   return Object.keys(player.stats ?? {}).reduce(
      (a, b, index) => {
         const numberOfSeasons = Object.keys(player?.stats || []).length;

         const statsA = a?.[projectedYear];
         const statsB = player?.stats?.[b];
         const keys = Object.keys(statsB || {});
         const projected = { [projectedYear]: {} };
         for (const key of keys) {
            if (
               player?.stats &&
               index === Object.keys(player?.stats || {}).length - 1
            ) {
               if (
                  statsB?.[key] === 0 &&
                  (statsA?.[key] === 0 || !statsA?.[key])
               ) {
                  projected[projectedYear][key] = 0;
               } else {
                  projected[projectedYear][key] =
                     Math.round(
                        (Math.round((statsB[key] + (statsA?.[key] || 0)) * 10) /
                           10 /
                           numberOfSeasons || 3) * 10
                     ) / 10;
               }
            } else {
               if (numberOfSeasons === 1 && key !== 'games') {
                  projected[projectedYear][key] =
                     (Math.round((statsB[key] + (statsA?.[key] || 0)) * 1.15) *
                        10) /
                     10;
               } else {
                  projected[projectedYear][key] =
                     statsB[key] + (statsA?.[key] || 0);
               }
            }
         }
         return projected;
      },
      { [projectedYear]: {} }
   );
};

export default projectStats;
