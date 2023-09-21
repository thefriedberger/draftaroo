'use server';

import { PlayerStats } from '@/lib/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const getPlayers = async (leagueID: string) => {
   const playersArray: Player[] = [];
   const supabase = createServerComponentClient<Database>({ cookies });
   const data = await fetch(
      'https://mfiegmjwkqpipahwvcbz.supabase.co/storage/v1/object/sign/players/players.json?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwbGF5ZXJzL3BsYXllcnMuanNvbiIsImlhdCI6MTY5Mzk0MDgxOCwiZXhwIjoxNzI1NDc2ODE4fQ.jGh3wUFUMqnOUiSQ63pCXaOSoliqeYTH-N1qJIZx4-E&t=2023-09-05T19%3A06%3A58.178Z'
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
