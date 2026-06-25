/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        regular: ['PlusJakartaSans-Regular'],
        medium: ['PlusJakartaSans-Medium'],
        semibold: ['PlusJakartaSans-SemiBold'],
        bold: ['PlusJakartaSans-Bold'],
        extrabold: ['PlusJakartaSans-ExtraBold'],
      },
      colors: {
        primary: {
          DEFAULT: '#185FA5',
          light: '#1E6FB8',
          dark: '#124C84',
        },
        alice: {
          from: '#2E7FD1',
          to: '#17A8C4',
        },
        accent: {
          amber: '#F59E0B',
          'amber-soft': '#FFF4E2',
          'amber-text': '#D97706',
          green: '#16A34A',
          'green-soft': '#EDF8F1',
          'green-text': '#15803D',
          red: '#EF4444',
          'red-soft': '#FDECEC',
          'red-text': '#DC2626',
          purple: '#7C3AED',
          'purple-soft': '#F1EBFE',
          indigo: '#4F46E5',
          'indigo-soft': '#ECEBFE',
          blue: '#2563EB',
          'blue-soft': '#EAF1FE',
        },
        surface: {
          bg: '#F4F6FA',
          board: '#E9ECF1',
          card: '#FFFFFF',
          border: '#EAEFF6',
          input: '#E3E9F1',
          divider: '#EEF2F7',
        },
        ink: {
          heading: '#0F1B2D',
          body: '#33475B',
          secondary: '#64748B',
          muted: '#94A3B5',
        },
      },
      borderRadius: {
        card: '16px',
        'card-lg': '20px',
        section: '20px',
        'section-lg': '24px',
        pill: '999px',
        btn: '14px',
        tile: '12px',
      },
      fontSize: {
        'display': ['32px', { fontWeight: '800', letterSpacing: '-0.5px' }],
        'hero': ['26px', { fontWeight: '800', letterSpacing: '-0.4px' }],
        'section': ['17px', { fontWeight: '800' }],
        'card-title': ['15px', { fontWeight: '800' }],
        'body': ['14.5px', { fontWeight: '500', lineHeight: '1.45' }],
        'label': ['13px', { fontWeight: '600' }],
        'eyebrow': ['12.5px', { fontWeight: '700', letterSpacing: '0.6px' }],
        'stat': ['28px', { fontWeight: '800' }],
      },
    },
  },
  plugins: [],
}