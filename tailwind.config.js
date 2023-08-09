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
            'emerald-primary': '#047857',
            purple: '#570478',
            gold: '#785704',
            'gray-primary': 'rgba(66, 58, 45, 0.6)',
         },
      },
   },
   plugins: [],
};
