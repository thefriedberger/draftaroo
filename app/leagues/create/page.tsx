'use server';

import { createClient } from '@/app/utils/supabase/server';
import CreateLeagueForm from '@/components/ui/forms/create-league';
import { UserResponse } from '@supabase/supabase-js';

const CreateLeague = async () => {
   const supabase = createClient();
   const { data: user }: Awaited<UserResponse> = await supabase.auth.getUser();
   return <>{user && <CreateLeagueForm />}</>;
};

export default CreateLeague;
