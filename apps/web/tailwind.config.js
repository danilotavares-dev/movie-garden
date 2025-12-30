/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient':
          'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(188,166,166,1) 26%, rgba(111,167,139,1) 60%, rgba(80,136,108,1) 78%, rgba(1,43,22,1) 100%)',
      },
    },
  },
  plugins: [],
}
