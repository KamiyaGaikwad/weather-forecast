/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'body-bg': '#111C3B',
        'body-text': '#dbdbdc',
        'light-blue': '#84B4EA',
        'search-btn-hover': '#7cafe9',
        'blue-whale': '#1F2B47',
        'temperature-text': '#82B3EB',
        'condition-icon-border': '#2C3854',
      },
    },
  },
  plugins: [],
}