'use server';

import { getUser } from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/server';
import CreateLeagueForm from '@/components/ui/forms/create-league';
import { User } from '@supabase/supabase-js';

const CreateLeague = async () => {
   const supabase = createClient();
   const user: Awaited<User | null> = await getUser(supabase);
   return <>{user && <CreateLeagueForm />}</>;
};

export default CreateLeague;
