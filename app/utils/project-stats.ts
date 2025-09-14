const projectStats = (player: Player) => {
   if (!player?.stats) return;
   return player.stats
      .filter((stats) => stats?.['stats'])
      .reduce(
         (a, b, index) => {
            const numberOfSeasons = (player?.stats || []).filter(
               (stats) => stats?.['stats']
            ).length;
            const statsA = a?.['stats'];
            const statsB = b?.['stats'];
            const keys = Object.keys(statsB || {});
            const projected = { stats: {} };
            for (const key of keys) {
               if (
                  player?.stats?.length &&
                  index === player?.stats?.length - 1
               ) {
                  if (
                     statsB?.[key] === 0 &&
                     (statsA?.[key] === 0 || !statsA?.[key])
                  ) {
                     projected.stats[key] = 0;
                  } else {
                     projected.stats[key] =
                        Math.round(
                           (Math.round(
                              (statsB[key] + (statsA?.[key] || 0)) * 10
                           ) /
                              10 /
                              numberOfSeasons || 3) * 10
                        ) / 10;
                  }
               } else {
                  if (numberOfSeasons === 1 && key !== 'games') {
                     projected.stats[key] =
                        (Math.round(
                           (statsB[key] + (statsA?.[key] || 0)) * 1.15
                        ) *
                           10) /
                        10;
                  } else {
                     projected.stats[key] = statsB[key] + (statsA?.[key] || 0);
                  }
               }
            }
            return projected;
         },
         { stats: {} }
      );
};

export default projectStats;
