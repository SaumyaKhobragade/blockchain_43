import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['var(--font-primary)', 'system-ui', 'sans-serif'],
        'funnel-display': ['var(--font-primary)', 'system-ui', 'sans-serif'],
        'funnel-sans': ['var(--font-primary)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#6366f1',
        secondary: '#22d3ee',
        accent: '#f97316',
        muted: '#94a3b8',
        'brand-dark': '#020817',
        'brand-light': '#f8fafc',
      },
      screens: {
        'sm': '640px',    // Default Tailwind 'sm'
        'md': '768px',    // Default Tailwind 'md'
        'lg': '1024px',   // Default Tailwind 'lg'
      },
      backgroundImage: {
        'white-pattern': "url('/assets/background/white.svg')",
        'blue-pattern': "url('/assets/background/blue.jpg')",
      },
    },
  },
  plugins: [],
};

export default config;
