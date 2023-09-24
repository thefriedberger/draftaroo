/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
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
            emerald: { primary: '#047857' },
            purple: '#570478',
            gold: '#785704',
            fuscia: '#bb4467',
            gray: {
               primary: '#3e3e3e',
               light: '#6e6e6e',
               dark: '#222222',
               scrollhover: '#5c5c5c',
            },
            blue: {
               muted: '#5065ad',
            },
         },
         gridTemplateColumns: {
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
   },
   plugins: [],
};
