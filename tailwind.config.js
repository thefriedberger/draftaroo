/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/ui/**/*.{js,ts,jsx,tsx}',
      './components/skeletons/**/*.{js,ts,jsx,tsx}',
   ],
   theme: {
      extend: {
         colors: {
            background: 'hsl(var(--background))',
            foreground: 'hsl(var(--foreground))',
            btn: {
               background: 'hsl(var(--btn-background))',
               'background-hover': 'hsl(var(--btn-background-hover))',
            },
            emerald: { primary: '#059669', dark: '#036345', light: '#06C689' },
            purple: '#570478',
            gold: '#785704',
            fuscia: { primary: '#bb4467', dark: '#963653' },
            gray: {
               primary: '#3e3e3e',
               light: '#6e6e6e',
               dark: '#222222',
               scrollhover: '#5c5c5c',
            },
            blue: {
               muted: '#7082D3',
               primary: '#354BAC',
            },
            paper: {
               primary: '#ADAD99',
               dark: '#91907e',
               light: '#DBDBD2',
               button: '#EDEDE8',
            },
            orange: { primary: '#DE8F52', muted: '#e6b58f' },
         },
         gridTemplateColumns: {
            2: 'repeat(2, minmax(0, 1fr))',
            3: 'repeat(3, minmax(0, 1fr))',
            4: 'repeat(4, minmax(0, 1fr))',
            5: 'repeat(5, minmax(0, 1fr))',
            13: 'repeat(13, minmax(0, 1fr))',
            14: 'repeat(14, minmax(0, 1fr))',
            15: 'repeat(15, minmax(0, 1fr))',
            16: 'repeat(16, minmax(0, 1fr))',
         },
         gridTemplateRows: {
            13: 'repeat(13, minmax(0, 1fr))',
            14: 'repeat(14, minmax(0, 1fr))',
            15: 'repeat(15, minmax(0, 1fr))',
            16: 'repeat(16, minmax(0, 1fr))',
         },
      },
      animation: {
         'bounce-1': '1s bounce 0s infinite',
         'bounce-1.5': '1s bounce .25s infinite',
         'bounce-2': '1s bounce .75s infinite',
         show: '0.25s show forwards',
         hide: '0.25s hide forwards',
         party: '2.5s party infinite',
         'party-delay': '2.475s party 2.87s infinite',
      },
   },
   plugins: [],
};
