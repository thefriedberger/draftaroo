export const createDraft = async ({
   supabase,
   params,
}: {
   supabase: any;
   params: { id: string };
}) => {
   await supabase.from('draft').insert({
      league_id: params.id,
   });
};
