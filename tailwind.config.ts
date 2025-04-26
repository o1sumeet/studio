import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(0, 0%, 98%)',
  			foreground: 'hsl(0, 0%, 9%)',
  			card: {
  				DEFAULT: 'hsl(0, 0%, 100%)',
  				foreground: 'hsl(0, 0%, 9%)'
  			},
  			popover: {
  				DEFAULT: 'hsl(0, 0%, 100%)',
  				foreground: 'hsl(0, 0%, 9%)'
  			},
  			primary: {
  				DEFAULT: 'hsl(0, 0%, 9%)',
  				foreground: 'hsl(0, 0%, 100%)'
  			},
  			secondary: {
  				DEFAULT: 'hsl(0, 0%, 96.1%)',
  				foreground: 'hsl(0, 0%, 9%)'
  			},
  			muted: {
  				DEFAULT: 'hsl(0, 0%, 96.1%)',
  				foreground: 'hsl(0, 0%, 45.1%)'
  			},
  			accent: {
  				DEFAULT: 'hsl(0, 0%, 96.1%)',
  				foreground: 'hsl(0, 0%, 9%)'
  			},
  			destructive: {
  				DEFAULT: 'hsl(0, 84.2%, 60.2%)',
  				foreground: 'hsl(0, 0%, 98%)'
  			},
  			border: 'hsl(0, 0%, 89.8%)',
  			input: 'hsl(0, 0%, 89.8%)',
  			ring: 'hsl(0, 0%, 9%)',
  			chart: {
  				'1': 'hsl(220, 70%, 50%)',
  				'2': 'hsl(160, 60%, 45%)',
  				'3': 'hsl(30, 80%, 55%)',
  				'4': 'hsl(280, 65%, 60%)',
  				'5': 'hsl(340, 75%, 55%)'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(240, 5.9%, 10%)',
  				foreground: 'hsl(240, 4.8%, 95.9%)',
  				primary: 'hsl(224.3, 76.3%, 48%)',
  				'primary-foreground': 'hsl(0, 0%, 100%)',
  				accent: 'hsl(240, 3.7%, 15.9%)',
  				'accent-foreground': 'hsl(240, 4.8%, 95.9%)',
  				border: 'hsl(240, 3.7%, 15.9%)',
  				ring: 'hsl(217.2, 91.2%, 59.8%)'
  			},
  			interactive: 'hsl(0, 0%, 9%)',
  			'interactive-hover': 'hsl(0, 0%, 20%)',
  			'interactive-foreground': 'hsl(0, 0%, 100%)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
