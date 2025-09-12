'use server';

import { PlayerStats } from '@/lib/types';
import { fetchLeague } from './helpers';
import { createClient } from './supabase/server';

const getPlayers = async (leagueID: string): Promise<Player[]> => {
   console.log(leagueID);
   if (!leagueID) return [];
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

   const league = await fetchLeague(supabase, leagueID);
   console.log('League: ', league);
   const league_scoring = await supabase
      .from('league_scoring')
      .select('*')
      .match({ id: league?.[0]?.league_scoring });
   console.log('League scoring: ', league_scoring);
   const leagueScoring = league_scoring?.data?.[0] as LeagueScoring;
   const seasons: string[] = [];
   const currentYear = new Date().getFullYear();
   for (let i = 3; i > 0; i--) {
      seasons.push(`${currentYear - i}${currentYear - i + 1}`);
   }

   const playersArray: Player[] = [];
   if (players && players.length > 0 && leagueScoring !== undefined) {
      for (const player of players) {
         if (!player.is_active) {
            continue;
         }

         // @ts-expect-error: this isn't a problem
         if (player.stats.length < 3) {
            seasons.forEach((season, index) => {
               // @ts-expect-error: this isn't a problem
               if (player?.stats[0]?.season !== season) {
                  if (season < seasons[1]) {
                     // @ts-expect-error: this isn't a problem
                     player.stats.unshift([{ stats: null, season: season }]);
                  } else {
                     // @ts-expect-error: this isn't a problem
                     player.stats.push({ stats: null, season: season });
                  }
               }
            });
         }

         const playerStats = player?.stats as PlayerStats[];
         for (const season in playerStats) {
            if (playerStats?.[season] !== undefined) {
               const { stats } = playerStats?.[season];
               let tempPoints: number = 0;
               let powerPlayAssists = 0;
               let shortHandedAssists = 0;
               for (const key in stats) {
                  const stat = key as keyof PlayerStats;
                  if (
                     (leagueScoring?.[stat] !== undefined ||
                        leagueScoring?.[stat]) &&
                     (stats?.[key] || null !== undefined || stats?.[key])
                  ) {
                     if (key === 'powerPlayPoints') {
                        if (
                           stats?.['powerPlayPoints'] !== undefined &&
                           stats?.['powerPlayGoals'] !== undefined &&
                           leagueScoring?.['powerPlayAssists']
                        ) {
                           powerPlayAssists =
                              stats?.['powerPlayPoints'] -
                              stats?.['powerPlayGoals'];
                           tempPoints +=
                              leagueScoring?.['powerPlayAssists'] *
                              (stats?.['powerPlayPoints'] -
                                 stats?.['powerPlayGoals']);
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
                              (stats['shortHandedPoints'] -
                                 stats['shortHandedGoals']);
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
         if (player) {
            console.log(player);
         }
         playersArray.push(player);
      }
   }

   console.log(playersArray.length, players.length);
   return playersArray as Player[];
};

export default getPlayers;
