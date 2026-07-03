/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mono: {
          bg: '#0A0A0A',
          'bg-secondary': '#111111',
          card: '#171717',
          elevated: '#1E1E1E',
          border: '#2A2A2A',
          divider: '#303030',
          hover: '#252525',
          pressed: '#303030',
          success: '#7A7A7A',
          warning: '#8C8C8C',
          error: '#9A9A9A',
        }
      },
      textColor: {
        mono: {
          primary: '#FFFFFF',
          secondary: '#CFCFCF',
          muted: '#8A8A8A',
          disabled: '#5E5E5E',
        }
      },
      borderRadius: {
        'btn': '14px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};
