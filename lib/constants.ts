export const teamTriCodes = [
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
export const teamMap = {
   ANA: 'Anaheim Ducks',
   UTA: 'Utah Hockey Club',
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

export const LeagueScoringMap: { [key: string]: string } = {
   assists: 'A',
   blocked: 'BLK',
   goals: 'G',
   hits: 'H',
   pim: 'PIM',
   plusMinus: '+/-',
   powerPlayAssists: 'PPA',
   powerPlayGoals: 'PPG',
   powerPlayPoints: 'PPP',
   shortHandedAssists: 'SHA',
   shortHandedGoals: 'SHG',
   shortHandedPoints: 'SHP',
   shots: 'S',
};

export const GoalieStatsMap: { [key: string]: string } = {
   wins: 'W',
   saves: 'S',
   goalsAgainst: 'GA',
   shutouts: 'SO',
};

export type SortValue =
   | 'season'
   | 'score'
   | 'averageScore'
   | 'timeOnIcePerGame'
   | 'games'
   | 'goals'
   | 'assists'
   | 'plusMinus'
   | 'pim'
   | 'powerPlayGoals'
   | 'powerPlayAssists'
   | 'shortHandedGoals'
   | 'shortHandedAssists'
   | 'shots'
   | 'hits'
   | 'blocked'
   | 'goalsAgainst'
   | 'wins'
   | 'saves'
   | 'shutouts'
   | 'goalAgainstAverage'
   | 'losses'
   | '';
export const teams = [
   'Team',
   'Arizona Coyotes',
   'Anaheim Ducks',
   'Boston Bruins',
   'Buffalo Sabres',
   'Calgary Flames',
   'Carolina Hurricanes',
   'Colorado Avalanche',
   'Columbus Blue Jackets',
   'Dallas Stars',
   'Detroit Red Wings',
   'Edmonton Oilers',
   'Florida Panthers',
   'Los Angeles Kings',
   'Minnesota Wild',
   'Montréal Canadiens',
   'Nashville Predators',
   'New Jersey Devils',
   'New York Islanders',
   'New York Rangers',
   'Ottawa Senators',
   'Philadelphia Flyers',
   'Pittsburgh Penguins',
   'San Jose Sharks',
   'Seattle Kraken',
   'St. Louis Blues',
   'Tampa Bay Lightning',
   'Tornto Maple Leafs',
   'Vancouver Canucks',
   'Vegas Golden Knights',
   'Washington Capitals',
   'Winnipeg Jets',
];
