import { supabase } from "./../lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

interface ICountry {
    countries: Array<Country>;
}
interface Country {
    id?: string | number;
    name?: string;
}

function Page() {
    const {countries} = supabase.from('countries')
    .stream(primaryKey: ['id'])
    .listen((List<Map<String, dynamic>> data));
  
    return (
        !!countries && (
            <ul>
                {countries.map((country) => (
                    <li key={country.id}>{country.name}</li>
                ))}
            </ul>
        )
    );
}

export async function getServerSideProps() {
    let { data } = await supabase.from("countries").select();

   



    return {
        props: {
            countries: data,
        },
    };
}

export default Page;
