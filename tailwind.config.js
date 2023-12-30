/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      "base-background": "#FDFDFD",
      "base-soft": '#fff9f3',
      "base-border": '#e9e9e9',
      "base-disabled": '#ffffff',
      "base-graybackground": '#f5f6f8',
      "main-primary": '#eb6d20',
      "main-third": '#EB8426',
      "main-light": '#D6D6D6',
      "main-medium": '#5F5F5F',
      "main-regular": '#303030',
      "main-white": '#FFFFFF',
      "main-tickblack": '#040404',
      "main-middleblack": '#0B0B0B',
      "main-softblack": '#1B1B1B',
      "main-card-background": "#D3FBD9",
      "text-2": "#3E3E3E",
      "text-6": "#292929",
      "SubText": "#9A9A9A",
      "Paragraph": "#292929",
      "system-success": "#6db95a",
      "system-error": "#dd5e5e",
      "system-warning": "#d89614",
      "system-url": "#177ddc",
    },
    extend: {},
  },
  plugins: [],
}