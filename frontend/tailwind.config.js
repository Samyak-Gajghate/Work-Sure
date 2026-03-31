/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '16px' }],
        xs:   ['12px', { lineHeight: '16px' }],
        sm:   ['13px', { lineHeight: '20px' }],
        base: ['14px', { lineHeight: '20px' }],
        md:   ['15px', { lineHeight: '22px' }],
        lg:   ['16px', { lineHeight: '24px' }],
        xl:   ['18px', { lineHeight: '28px' }],
        '2xl':['22px', { lineHeight: '32px' }],
        '3xl':['28px', { lineHeight: '36px' }],
      },
      colors: {
        brand: {
          DEFAULT: '#7c3aed',
          hover:   '#6d28d9',
          light:   '#ede9fe',
          secondary: '#06b6d4',
        },
        sidebar: {
          bg:     '#1a1d23',
          hover:  '#252932',
          active: '#7c3aed',
          text:   '#9ca3af',
          label:  '#4b5563',
          border: '#2d3139',
        },
        surface: {
          bg:     '#f4f5f7',
          card:   '#ffffff',
          border: '#e5e7eb',
          subtle: '#f0f0f0',
        },
        status: {
          todo:       '#6b7280',
          inprogress: '#3b82f6',
          inreview:   '#f59e0b',
          done:       '#10b981',
        },
        priority: {
          low:      '#9ca3af',
          medium:   '#3b82f6',
          high:     '#f97316',
          critical: '#ef4444',
        },
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        full: '9999px',
      },
      boxShadow: {
        sm:   '0 1px 2px rgba(0,0,0,0.05)',
        md:   '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
        lg:   '0 10px 15px -3px rgba(0,0,0,0.1)',
        card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        xl:   '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      animation: {
        'slide-in-right': 'slideInRight 0.2s ease-out',
        'slide-in-bottom': 'slideInBottom 0.2s ease-out',
        'fade-in': 'fadeIn 0.15s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        slideInBottom: {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to:   { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
