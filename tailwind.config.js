/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        background: 'hsl(210, 20%, 99%)', // Off-white page background
        foreground: 'hsl(222, 47%, 11%)', // Deep navy primary text
        
        // Card/Modal colors
        card: {
          DEFAULT: 'hsl(0, 0%, 100%)', // Pure white
          foreground: 'hsl(222, 47%, 11%)', // Deep navy
        },
        
        // Primary colors (Navy - Authority elements)
        primary: {
          DEFAULT: 'hsl(222, 47%, 11%)', // Deep navy
          foreground: 'hsl(0, 0%, 100%)', // White text on navy
        },
        
        // Accent colors (Emerald - Action items only)
        accent: {
          DEFAULT: 'hsl(160, 84%, 39%)', // Emerald
          foreground: 'hsl(0, 0%, 100%)', // White text on emerald
        },
        
        // Muted colors (Gray scale)
        muted: {
          DEFAULT: 'hsl(210, 40%, 96%)', // Light gray hover states
          foreground: 'hsl(215, 16%, 47%)', // Slate gray secondary text
        },
        'muted-foreground': 'hsl(215, 16%, 47%)', // Slate gray
        
        // Secondary colors (Soft gray)
        secondary: {
          DEFAULT: 'hsl(210, 40%, 96%)', // Soft gray
          foreground: 'hsl(222, 47%, 11%)', // Navy text
        },
        
        // Border colors
        border: 'hsl(214, 32%, 91%)', // Light gray
        input: 'hsl(214, 32%, 91%)', // Light gray border for inputs
        ring: 'hsl(160, 84%, 39%)', // Emerald glow for focus rings
        
        // Destructive colors (Red - Errors/Delete)
        destructive: {
          DEFAULT: 'hsl(0, 84%, 60%)', // Red
          foreground: 'hsl(0, 0%, 100%)', // White text on red
        },
      },
    },
  },
  plugins: [require('daisyui'),],
}

