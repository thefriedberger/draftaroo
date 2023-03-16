import { supabase } from './../lib/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';

interface ICountry {
   countries: Array<Country>;
}
interface Country {
   id: number;
   name?: string;
   city?: string;
}

function Page({ countries }: ICountry) {
   const [countryList, setCountryList] = useState(countries);

   const deleteCountry = (newData: Country) => {
      console.log(
         countryList.filter((country) => {
            return country.id === newData.id;
         })
      );
   };
   const addCountry = (newData: Country) => {
      setCountryList((countryList) => [...countryList, newData]);
   };
   const updateCountry = (newData: Country) => {
      deleteCountry(newData);
      addCountry(newData);
   };

   const receivedDatabaseEvent = (event: any) => {
      const { eventType } = event;
      const newData = event.new;
      switch (eventType) {
         case 'DELETE':
            deleteCountry(newData);
            break;
         case 'INSERT':
            addCountry(newData);
            break;
         case 'UPDATE':
            updateCountry(newData);
            break;
      }
   };

   const channelId = 'custom-all-channel';

   const databaseFilter = {
      schema: 'public',
      table: 'countries',
      event: '*',
   };
   const channel = supabase
      .channel(channelId)
      .on('postgres_changes', databaseFilter, (payload: any) => {
         receivedDatabaseEvent(payload);
      })
      .subscribe();

   console.log(countryList);
   return (
      !!countryList && (
         <ul>
            {countryList.map((country) => (
               <li key={country.id}>{country.name}</li>
            ))}
         </ul>
      )
   );
}

export async function getStaticProps() {
   let { data } = await supabase.from('countries').select();

   return {
      props: {
         countries: data,
      },
   };
}

export default Page;
