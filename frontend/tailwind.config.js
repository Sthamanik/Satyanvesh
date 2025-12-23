/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "background-primary": "hsl(var(--background))",
        "text-secondary": "hsl(var(--foreground))",
        "brand-primary": "hsl(var(--primary))",
        "brand-secondary": "hsl(var(--secondary))",
        "status-error": "hsl(var(--destructive))",
        "background-secondary": "hsl(var(--card))",
      },
    },
  },
  plugins: [],
};
