'use server';

import { PlayerStats } from '@/lib/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const getPlayers = async (leagueID: string) => {
   const playersArray: Player[] = [];
   const supabase = createServerComponentClient<Database>({ cookies });
   // const data = await fetch(
   //    'https://mfiegmjwkqpipahwvcbz.supabase.co/storage/v1/object/sign/players/players_updated.json?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwbGF5ZXJzL3BsYXllcnNfdXBkYXRlZC5qc29uIiwiaWF0IjoxNzIyODc2NjczLCJleHAiOjE3NTQ0MTI2NzN9.Kd2ePms6fptXkFpL8vGqds_NsAEql0HSElcAxnW1hBw&t=2024-08-05T16%3A51%3A12.434Z',
   //    { cache: 'force-cache' }
   // );
   // const players = await data.json();
   const data = await fetch(
      'https://mfiegmjwkqpipahwvcbz.supabase.co/storage/v1/object/sign/players/players-updated-2.json?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwbGF5ZXJzL3BsYXllcnMtdXBkYXRlZC0yLmpzb24iLCJpYXQiOjE3MjI4ODM0MjUsImV4cCI6MTc1NDQxOTQyNX0.K2Xt9D5JB2buQGheR-DY4FdbHottVR9kcyvIDQQ_Nbg&t=2024-08-05T18%3A43%3A44.538Z'
   );
   const players = await data.json();
   const league = await supabase
      .from('leagues')
      .select('*')
      .match({ league_id: leagueID });
   const league_scoring = await supabase
      .from('league_scoring')
      .select('*')
      .eq('id', String(league?.data?.[0]?.league_scoring) || '');
   const leagueScoring = league_scoring?.data?.[0] as LeagueScoring | any;
   if (players.length > 0 && leagueScoring !== undefined) {
      players.forEach((player: Player) => {
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
      });
      return playersArray;
   }
   return false;
};

export default getPlayers;
