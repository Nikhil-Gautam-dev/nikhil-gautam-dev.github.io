/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        warm: '#F9F7F4',
        'warm-surface': '#F2EFE9',
        'warm-border': '#E0DDD8',
        ink: '#111110',
        muted: '#6B6B68',
        accent: '#E05C00',
        'accent-light': '#FF7A2F',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.06em' }],
        sm: ['0.875rem', { lineHeight: '1.4rem' }],
        base: ['1rem', { lineHeight: '1.6rem' }],
        lg: ['1.125rem', { lineHeight: '1.7rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['4rem', { lineHeight: '1.05' }],
        '7xl': ['5rem', { lineHeight: '1' }],
        '8xl': ['6.5rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        hero: ['clamp(5.5rem, 14vw, 12rem)', { lineHeight: '0.95' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0em',
        wide: '0.05em',
        wider: '0.08em',
        widest: '0.16em',
        ultrawide: '0.24em',
      },
      maxWidth: {
        container: '1240px',
        reading: '65ch',
        narrow: '42ch',
      },
      spacing: {
        section: 'clamp(5rem, 10vw, 9rem)',
        'section-sm': 'clamp(3rem, 6vw, 5rem)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        snappy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'fade-in': 'fadeIn 0.5s ease both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
