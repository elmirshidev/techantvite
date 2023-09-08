/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
          'mainBg': '#eae8e0',
          'yellow-500' : '#ffe450',
          'gray' : '#F1EFE3' ,
          'orange-600' : '#dd6b20',
          'gray-950' : '#242420',
          'black' : '#000000',
          'white' : '#ffffff' ,
          'green-500' : '#00be68'
      },
      screens: {
        '500' : {max: '500px'},
        '370' : {max: '370px'},
        '796': {max: '796px'}
      }
    },
  },
  plugins: [],
}

