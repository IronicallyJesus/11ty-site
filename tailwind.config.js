/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,njk,md,js}',
    './.eleventy.js',
  ],
  theme: {
    extend: {},
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};