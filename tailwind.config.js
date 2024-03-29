const colors = require('tailwindcss/colors');
const forms = require('@tailwindcss/forms');

module.exports = {
  purge: {
    content: ['./public/**/*.html', './src/**/*.vue'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blue: colors.lightBlue,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [forms],
};
