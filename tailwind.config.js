export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'var(--accent-pink)',
          gold: 'var(--accent-gold)',
          pink: 'var(--accent-pink)',
          rose: 'var(--accent-rose)',
          lavender: 'var(--accent-lavender)',
          blush: 'var(--accent-blush)',
          ivory: 'var(--accent-ivory)',
        },
        title: 'var(--title)',
        muted: 'var(--muted)',
      },
      fontFamily: {
        vazirmatn: ['Vazirmatn', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
