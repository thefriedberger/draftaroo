import { useState } from 'react';
import { supabase } from './../lib/supabaseClient';

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

   const deleteCountry = (old: Country) => {
      setCountryList(
         countryList.filter((country) => {
            return country.id !== old.id;
         })
      );
   };
   const addCountry = (newData: Country) => {
      setCountryList((countryList) => [...countryList, newData]);
   };
   const updateCountry = (old: Country, newData: Country) => {
      deleteCountry(old);
      addCountry(newData);
   };

   const receivedDatabaseEvent = (event: any) => {
      const { old, eventType } = event;
      const newData = event.new;
      switch (eventType) {
         case 'DELETE':
            deleteCountry(old);
            break;
         case 'INSERT':
            addCountry(newData);
            break;
         case 'UPDATE':
            updateCountry(old, newData);
            break;
      }
   };

   const channelId = 'custom-all-channel';

   const channel = supabase
      .channel(channelId)
      .on(
         'postgres_changes',
         { event: '*', schema: 'public', table: 'countries' },
         (payload: any) => {
            receivedDatabaseEvent(payload);
         }
      )
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
