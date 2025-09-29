const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}`;
const supabaseKey = `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`;
const supabase = createClient(supabaseUrl, supabaseKey);
const teamTriCodes = [
   'ANA',
   'CBJ',
   'SEA',
   'UTA',
   'DET',
   'WPG',
   'NJD',
   'NYI',
   'NYR',
   'SJS',
   'BOS',
   'FLA',
   'TBL',
   'CHI',
   'PIT',
   'PHI',
   'CAR',
   'DAL',
   'LAK',
   'VAN',
   'TOR',
   'OTT',
   'BUF',
   'STL',
   'MIN',
   'EDM',
   'VGK',
   'NSH',
   'MTL',
   'COL',
   'WSH',
   'CGY',
];
const teamMap = {
   ANA: 'Anaheim Ducks',
   UTA: 'Utah Mammoth',
   BUF: 'Buffalo Sabres',
   BOS: 'Boston Bruins',
   CGY: 'Calgary Flames',
   CAR: 'Carolina Hurricanes',
   CHI: 'Chicago Blackhawks',
   CBJ: 'Columbus Blue Jackets',
   COL: 'Colorado Avalanche',
   DAL: 'Dallas Stars',
   DET: 'Detroit Red Wings',
   EDM: 'Edmonton Oilers',
   FLA: 'Florida Panthers',
   LAK: 'Los Angeles Kings',
   MIN: 'Minnesota Wild',
   MTL: 'Montréal Canadiens',
   NJD: 'New Jersey Devils',
   NSH: 'Nashville Predators',
   NYI: 'New York Islanders',
   NYR: 'New York Rangers',
   OTT: 'Ottawa Senators',
   PHI: 'Philadelphia Flyers',
   PIT: 'Pittsburgh Penguins',
   SEA: 'Seattle Kraken',
   SJS: 'San Jose Sharks',
   STL: 'St. Louis Blues',
   TBL: 'Tampa Bay Lightning',
   TOR: 'Toronto Maple Leafs',
   VAN: 'Vancouver Canucks',
   VGK: 'Vegas Golden Knights',
   WPG: 'Winnipeg Jets',
   WSH: 'Washington Capitals',
};

const updatePlayers = async () => {
   const headers = {
      mode: 'no-cors',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
   };

   const players: Player[] = [];

   const populatePlayer = (player) => {
      return {
         id: player.id,
         headshot: player.headshot,
         first_name: player.firstName.default,
         last_name: player.lastName.default,
         sweater_number: player.sweaterNumber,
         primary_position: player.positionCode,
         current_team: player.currentTeam,
         stats: {},
         is_active: player.isActive ?? true,
      };
   };

   const extractPlayers = (roster, team) => {
      const positions = ['forwards', 'defensemen', 'goalies'];
      for (const position of positions) {
         roster[position].forEach((player) => {
            player.currentTeam = teamMap?.[team] ?? 'FA';
            players.length
               ? players.filter(
                    (existingPlayer) => existingPlayer.id === player.id
                 ).length < 1 && players.push(populatePlayer(player))
               : players.push(populatePlayer(player));
         });
      }
   };

   const seasonCodes = Array.from({ length: 3 })
      .map((k, i) => {
         const currentYear = new Date().getUTCFullYear();
         return `${currentYear - i - 1}${currentYear - i}`;
      })
      .reverse();
   for (const team of teamTriCodes) {
      const rosterResponse = await fetch(
         `https://api-web.nhle.com/v1/roster/${team}/20252026`
      );
      const roster = await rosterResponse.json();
      extractPlayers(roster, team);

      const prospectsResponse = await fetch(
         `https://api-web.nhle.com/v1/prospects/${team}`
      );
      const prospects = await prospectsResponse.json();
      extractPlayers(prospects, team);
   }
   const extractStats = async (realtimePlayers, summaryPlayers, season) => {
      const mappedPlayers: Player[] = summaryPlayers.map((summaryStat) => {
         const realtimeStats = realtimePlayers.find(
            (rtPlayer) => rtPlayer.playerId === summaryStat.playerId
         );
         if (realtimeStats) {
            return {
               id: realtimeStats.playerId,
               stats: {
                  [season]: {
                     hits: realtimeStats.hits,
                     blocked: realtimeStats.blockedShots,
                     timeOnIcePerGame: realtimeStats.timeOnIcePerGame,
                     assists: summaryStat.assists,
                     goals: summaryStat.goals,
                     pim: summaryStat.penaltyMinutes,
                     powerPlayGoals: summaryStat.ppGoals,
                     powerPlayPoints: summaryStat.ppPoints,
                     shortHandedGoals: summaryStat.shGoals,
                     shortHandedPoints: summaryStat.shPoints,
                     shots: summaryStat.shots,
                     games: summaryStat.gamesPlayed,
                     plusMinus: summaryStat.plusMinus,
                  },
               },
            };
         }
      });
      for (const tempPlayer of mappedPlayers) {
         players.forEach((player) => {
            if (player.id === tempPlayer?.id) {
               if (!player?.stats) {
                  player.stats = {};
               }
               player.stats[season] = tempPlayer?.stats?.[season];
            }
         });
      }
   };
   const extractGoalieStats = (allGoalies, season) => {
      allGoalies.forEach((goalie) => {
         players.forEach((player) => {
            if (goalie.playerId === player.id) {
               if (!player?.stats) {
                  player.stats = {};
               }
               player.stats[season] = {
                  timeOnIce: goalie.timeOnIce,
                  ot: goalie.otLosses,
                  shutouts: goalie.shutouts,
                  wins: goalie.wins,
                  losses: goalie.losses,
                  saves: goalie.saves,
                  savePercentage: goalie.savePct,
                  goalAgainstAverage: goalie.goalsAgainstAverage,
                  games: goalie.gamesPlayed,
                  gamesStarted: goalie.gamesStarted,
                  shotsAgainst: goalie.shotsAgainst,
                  goalsAgainst: goalie.goalsAgainst,
               };
            }
         });
      });
   };

   for (const season of seasonCodes) {
      const skatersRealtimeResponse = await fetch(
         `https://api.nhle.com/stats/rest/en/skater/realtime?limit=-1&cayenneExp=seasonId=${season}%20and%20gameTypeId=2`,
         { method: 'GET', headers: headers }
      );
      const realtimePlayers = await skatersRealtimeResponse.json();

      const skatersSummaryResponse = await fetch(
         `https://api.nhle.com/stats/rest/en/skater/summary?limit=-1&cayenneExp=seasonId=${season}%20and%20gameTypeId=2`,
         { method: 'GET', headers: headers }
      );
      const summaryPlayers = await skatersSummaryResponse.json();
      extractStats(realtimePlayers.data, summaryPlayers.data, season);

      const goaliesResponse = await fetch(
         `https://api.nhle.com/stats/rest/en/goalie/summary?limit=-1&cayenneExp=seasonId=${season}%20and%20gameTypeId=2`,
         { method: 'GET', headers: headers }
      );

      const goalies = await goaliesResponse.json();
      extractGoalieStats(goalies.data, season);
   }

   const deleteAllRows = async () => {
      const { error } = await supabase.from('players').delete().neq('id', 0); // deletes all rows
   };
   // deleteAllRows();
   const insertPlayerRows = async () => {
      const { data, error } = await supabase
         .from('players')
         .upsert(players)
         .select();
   };
   insertPlayerRows();
};

export default updatePlayers;
