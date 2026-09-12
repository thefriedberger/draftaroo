'use server';

import { PlayerStats, stats } from '@/lib/types';
import projectStats from './project-stats';
import { createClient } from './supabase/server';

const getPlayers = async (league: League): Promise<Player[]> => {
   const supabase = createClient();
   let skip = 0;
   let total = 1000;
   let players: Player[] = [];

   do {
      const { data, count, error } = await supabase
         .from('players')
         .select('*', { count: 'exact' })
         .range(skip, total);
      if (data) {
         for (const player of data) {
            if (!players.some((p) => player.id === p.id)) {
               players.push(player);
            }
         }
      }
      total = count ?? 5000;
      skip = players?.length ?? 0;
   } while (skip < total);

   const league_scoring = await supabase
      .from('league_scoring')
      .select('*')
      .match({ id: league?.league_scoring });

   const leagueScoring = league_scoring?.data?.[0] as LeagueScoring;
   const playersArray: Player[] = [];
   if (players && players.length > 0 && leagueScoring !== undefined) {
      for (const player of players) {
         if (!player.is_active) {
            continue;
         }

         const playerStats = player?.stats as PlayerStats[];

         for (const season in playerStats) {
            if (playerStats?.[season] !== undefined) {
               const stats = playerStats?.[season] as stats;
               let tempPoints: number = 0;
               let powerPlayAssists = 0;
               let shortHandedAssists = 0;
               for (const key in stats) {
                  if (
                     key === 'powerPlayAssists' ||
                     key === 'shortHandedAssists'
                  )
                     continue;

                  const stat = key as keyof PlayerStats;
                  if (
                     (leagueScoring?.[stat] !== undefined ||
                        leagueScoring?.[stat]) &&
                     (stats?.[key] || null !== undefined || stats?.[key])
                  ) {
                     if (
                        player.first_name === 'Jason' &&
                        player.last_name === 'Robertson'
                     ) {
                        console.log(season, key);
                     }
                     if (key === 'powerPlayPoints') {
                        if (
                           stats?.['powerPlayPoints'] &&
                           stats?.['powerPlayGoals'] &&
                           leagueScoring?.['powerPlayAssists']
                        ) {
                           powerPlayAssists =
                              stats?.['powerPlayPoints'] -
                              stats?.['powerPlayGoals'];

                           tempPoints +=
                              leagueScoring?.['powerPlayAssists'] *
                              powerPlayAssists;
                        }
                     } else if (key === 'shortHandedPoints') {
                        if (
                           stats?.['shortHandedPoints'] !== undefined &&
                           stats?.['shortHandedGoals'] !== undefined &&
                           leagueScoring?.['shortHandedAssists']
                        ) {
                           shortHandedAssists =
                              stats['shortHandedPoints'] -
                              stats['shortHandedGoals'];

                           tempPoints +=
                              leagueScoring?.['shortHandedAssists'] *
                              shortHandedAssists;
                        }
                     } else {
                        tempPoints += leagueScoring?.[stat] * stats?.[stat];
                     }
                  }
               }
               if (stats) {
                  stats.powerPlayAssists = powerPlayAssists;
                  stats.shortHandedAssists = shortHandedAssists;
               }
               if (stats && tempPoints > 0) {
                  stats.score = Math.round(tempPoints * 100) / 100;
                  stats.averageScore =
                     Math.round((tempPoints / (stats?.games || 1)) * 100) / 100;
               }
            }
         }
         if (player?.stats) {
            let projectedStats = projectStats(player);

            const currentYear = new Date().getUTCFullYear();
            const projectedKey = `${currentYear}${currentYear + 1} (proj.)`;

            if (!player.stats[projectedKey]) {
               player.stats[projectedKey] = projectedStats?.[projectedKey];
            } else {
               const mult =
                  player.stats[projectedKey]?.['projectionMultiplier'] || 1.15;

               const keys = Object.keys(player.stats[projectedKey]);

               for (const key of keys) {
                  if (key === 'games') continue;
                  if (['score', 'averageScore'].includes(key)) {
                     player.stats[projectedKey][key] =
                        Math.round(
                           player.stats[projectedKey][key] * mult * 10
                        ) / 10;
                  } else {
                     player.stats[projectedKey][key] = Math.round(
                        Math.round(player.stats[projectedKey][key] * mult)
                     );
                  }
               }
            }
         }
         playersArray.push(player);
      }
   }

   return playersArray as Player[];
};

export default getPlayers;
