/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      'cupcake',
      'dark',
      'cmyk',
      {
        mytheme: {
          primary: '#81A4CD', // Light blue
          secondary: '#6A1510', // Dark red
          accent: '#F4EED6', // Light beige
          neutral: '#3C2F2F', // Dark grey
          'base-100': '#f5fffe',
          'base-200': '#e8faf8', // Ivory
          info: '#2F4F4F', // Dark slate grey
          success: '#8FBC8F', // Dark sea green
          warning: '#CFB53B', // Dark goldenrod
          error: '#800000', // Maroon
          customPrimary: '#FFFFF0', // Ivory (custom color)
          '--rounded-box': '0.5rem', // Border radius for large boxes (e.g., cards)
          '--rounded-btn': '0.25rem', // Border radius for buttons
          '--rounded-badge': '1.9rem', // Border radius for badges
          '--animation-btn': '0.25s', // Duration of button click animation
          '--animation-input': '0.2s', // Duration of input animations (checkbox, toggle, radio, etc.)
          '--btn-focus-scale': '0.95', // Scale transform when button is focused
          '--border-btn': '1px', // Border width for buttons
          '--tab-border': '1px', // Border width for tabs
          '--tab-radius': '0.5rem', // Border radius for tabs
        },
      },
    ],
  },
};
