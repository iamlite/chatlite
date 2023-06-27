module.exports = {
  content: ['./**/*.{html,js}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#f59e0b',
          secondary: '#e7e5e4',
          accent: '#fcd34d',
          neutral: '#f5f5f4',
          'base-100': '#1c1917',
          info: '#06b6d4',
          success: '#a3e635',
          warning: '#b45309',
          error: '#ff7070',
        },
      },
    ],
  },
};
