/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 避免AI味的蓝紫渐变，使用更有质感的配色
        ink: {
          50: '#f7f7f5',
          100: '#e8e6e1',
          200: '#d3cfc6',
          300: '#b8b2a4',
          400: '#9d9484',
          500: '#8a7f6d',
          600: '#756a5a',
          700: '#5f564a',
          800: '#504940',
          900: '#453f38',
          950: '#26231f',
        },
        gold: {
          50: '#fdfbf7',
          100: '#f9f3e6',
          200: '#f2e4c9',
          300: '#e8d0a4',
          400: '#ddb87c',
          500: '#d4a35c',
          600: '#c68a4a',
          700: '#a56f3f',
          800: '#865a38',
          900: '#6d4a30',
          950: '#3a2618',
        },
        jade: {
          50: '#f4f9f7',
          100: '#dbece5',
          200: '#b7d8cb',
          300: '#8bbdab',
          400: '#629d88',
          500: '#48816e',
          600: '#386758',
          700: '#2f5349',
          800: '#29443c',
          900: '#243933',
          950: '#11201c',
        },
        vermilion: {
          50: '#fef4f2',
          100: '#fee6e2',
          200: '#fdd1ca',
          300: '#fbb0a4',
          400: '#f68270',
          500: '#ec5a45',
          600: '#d93f28',
          700: '#b6311e',
          800: '#972c1c',
          900: '#7d2a1d',
          950: '#44120a',
        }
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'STSong', 'SimSun', 'serif'],
        sans: ['Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'particle': 'particle 8s linear infinite',
        'fadeIn': 'fadeIn 0.5s ease-out',
        'slideUp': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 163, 92, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(212, 163, 92, 0.6)' },
        },
        particle: {
          '0%': { transform: 'translateY(100vh) scale(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) scale(1)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'ink-wash': 'linear-gradient(180deg, #26231f 0%, #453f38 50%, #26231f 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4a35c 0%, #e8d0a4 50%, #d4a35c 100%)',
      }
    },
  },
  plugins: [],
}
