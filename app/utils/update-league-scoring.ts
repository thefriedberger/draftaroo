'use server';
import { createClient } from './supabase/server';

const updateLeagueScoring = async (
   formData: FormData,
   leagueScoringId: string
) => {
   const scoring = {
      goals: Number(formData.get('goals')),
      assists: Number(formData.get('assists')),
      plus_minus: Number(formData.get('plusMinus')),
      pim: Number(formData.get('pim')),
      powerplay_goals: Number(formData.get('powerPlayGoals')),
      powerplay_assists: Number(formData.get('powerPlayAssists')),
      powerplay_points: Number(formData.get('powerPlayPoints')),
      shorthanded_goals: Number(formData.get('shortHandedGoals')),
      shorthanded_assists: Number(formData.get('shortHandedAssists')),
      shorthanded_points: Number(formData.get('shortHandedPoints')),
      shots: Number(formData.get('shots')),
      hits: Number(formData.get('hits')),
      blocks: Number(formData.get('blocked')),
      wins: Number(formData.get('wins')),
      goals_against: Number(formData.get('goalsAgainst')),
      saves: Number(formData.get('saves')),
      shutouts: Number(formData.get('shutouts')),
   };
   const {
      goals,
      assists,
      powerplay_assists,
      powerplay_goals,
      powerplay_points,
      plus_minus,
      shorthanded_assists,
      shorthanded_goals,
      shorthanded_points,
      hits,
      blocks,
      pim,
      shots,
      wins,
      saves,
      goals_against,
      shutouts,
   } = scoring;

   const supabase = createClient();

   await supabase
      .from('league_scoring')
      .update({
         goals: goals,
         assists: assists,
         powerPlayAssists: powerplay_assists,
         powerPlayGoals: powerplay_goals,
         powerPlayPoints: powerplay_points,
         plusMinus: plus_minus,
         shortHandedAssists: shorthanded_assists,
         shortHandedGoals: shorthanded_goals,
         shortHandedPoints: shorthanded_points,
         hits: hits,
         blocked: blocks,
         shots: shots,
         wins: wins,
         pim: pim,
         saves: saves,
         goalsAgainst: goals_against,
         shutouts: shutouts,
      })
      .match({ id: leagueScoringId })
      .select();
};

export default updateLeagueScoring;
