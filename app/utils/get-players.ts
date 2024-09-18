'use server';

import { PlayerStats } from '@/lib/types';
import { cache } from 'react';
import { createClient } from './supabase/server';

const getPlayers = cache(async (leagueID: string): Promise<Player[]> => {
   const playersArray: Player[] = [];
   if (!leagueID) return playersArray;
   const supabase = createClient();
   let { data: players, error } = await supabase.from('players').select('*');
   const league = await supabase
      .from('leagues')
      .select('*')
      .match({ league_id: leagueID });
   const league_scoring = await supabase
      .from('league_scoring')
      .select('*')
      .eq('id', String(league?.data?.[0]?.league_scoring) || '');
   const leagueScoring = league_scoring?.data?.[0] as LeagueScoring | any;
   const seasons: string[] = [];
   const currentYear = new Date().getFullYear();
   for (let i = 2; i > 0; i--) {
      seasons.push(`${currentYear - i}${currentYear - i + 1}`);
   }
   if (players && players.length > 0 && leagueScoring !== undefined) {
      for (const player of players) {
         if (!player.is_active) continue;

         if (player.stats.length < 2) {
            seasons.forEach((season, index) => {
               if (player?.stats[0]?.season !== season) {
                  if (season < seasons[1]) {
                     player.stats.unshift([{ stats: null, season: season }]);
                  } else {
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
                           stats?.['powerPlayGoals'] !== undefined
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
                           stats?.['shortHandedGoals'] !== undefined
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
         playersArray.push(player);
      }
   }
   return playersArray as Player[];
});

export default getPlayers;
