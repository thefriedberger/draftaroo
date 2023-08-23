'use server';
import {
   User,
   createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const createLeague = async (
   formData: FormData,
   draftPicks: any,
   user: User
) => {
   const leagueName = String(formData.get('league-name'));
   const rules = {
      number_of_teams: Number(formData.get('number_of_teams')) || 1,
      keepers_enabled: Boolean(formData.get('keepers_enabled')) || false,
      number_of_rounds: Number(formData.get('number_of_picks')) || null,
      draft_picks: draftPicks || null,
      draft_style: String(formData.get('draft_style')) || 'standard',
   };
   const scoring = {
      goals: Number(formData.get('goals')) | 2,
      assists: Number(formData.get('assists')) | 1.5,
      plus_minus: Number(formData.get('plus_minus')) | 0.5,
      powerplay_goals: Number(formData.get('ppg')) | 1.5,
      powerplay_assists: Number(formData.get('ppa')) | 1,
      powerplay_points: Number(formData.get('ppp')) | 1,
      shorthanded_goals: Number(formData.get('shg')) | 3,
      shorthanded_assists: Number(formData.get('sha')) | 2.5,
      shorthanded_points: Number(formData.get('shp')) | 3,
      shots: Number(formData.get('shots')) | 0.25,
      hits: Number(formData.get('hits')) | 0.5,
      blocks: Number(formData.get('blocks')) | 0.75,
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
      shots,
   } = scoring;
   const {
      keepers_enabled,
      number_of_rounds,
      number_of_teams,
      draft_style,
      draft_picks,
   } = rules;

   const generateLeagueId = async () => {
      const supabase = createServerComponentClient<Database>({ cookies });
      const { data } = await supabase.from('leagues').select('league_id');
      let leagueId;
      if (data?.length === 0) {
         return Math.random().toString(30).slice(2);
      }
      data?.forEach((league) => {
         leagueId = Math.random().toString(30).slice(2);
         do {
            leagueId = Math.random().toString(30).slice(2);
         } while (league.league_id === leagueId);
      });
      return leagueId;
   };

   const leagueId = await generateLeagueId();

   const supabase = createServerComponentClient<Database>({ cookies });

   const league_scoring = await supabase
      .from('league_scoring')
      .insert({
         goals: goals,
         assists: assists,
         powerplay_assists: powerplay_assists,
         powerplay_goals: powerplay_goals,
         powerplay_points: powerplay_points,
         plus_minus: plus_minus,
         shorthanded_assists: shorthanded_assists,
         shorthanded_goals: shorthanded_goals,
         shorthanded_points: shorthanded_points,
         hits: hits,
         blocks: blocks,
         shots: shots,
      })
      .select();
   const league_rules = await supabase
      .from('league_rules')
      .insert({
         keepers_enabled: keepers_enabled,
         number_of_rounds: number_of_rounds,
         number_of_teams: number_of_teams,
         draft_style: draft_style,
         draft_picks: draft_picks,
      })
      .select();

   if (user && leagueId) {
      const owner = user.id;
      const { data, error } = await supabase
         .from('leagues')
         .insert({
            league_id: leagueId,
            league_name: leagueName,
            owner: owner,
            league_rules: league_rules?.data?.[0].id,
            league_scoring: league_scoring?.data?.[0].id,
         })
         .select();
      if (error) return;
      redirect(`/leagues/${data?.[0].league_id}`);
   }
};

export default createLeague;
