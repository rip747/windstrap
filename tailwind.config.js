/** @type {import('tailwindcss').Config} */
module.exports = {
  /*
   * Content scanning must NOT include the CSS sources: every WindStrap class
   * is produced via `@apply`, and scanning our own .css would make Tailwind
   * re-generate colliding utilities (e.g. its default `.mt-3`) that would
   * override the Bootstrap values.
   */
  content: ['./index.html', './src/**/*.{html,js}'],
  theme: {
    /*
     * Bootstrap 5.3.8 breakpoints, so Tailwind's responsive variants
     * (sm:, md:, lg:, xl:, xxl:) fire at exactly the same widths as
     * Bootstrap's media queries. This is what makes the 1:1
     * `.col-sm-6 { @apply sm:... }` style translation possible.
     */
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1400px',
    },
    /*
     * Bootstrap's spacing utilities (m-1…m-5) are translated via arbitrary
     * values in scripts/generate-utilities.js, so we intentionally leave
     * Tailwind's default spacing scale untouched.
     */
    extend: {
      colors: {
        primary: '#0d6efd',
        secondary: '#6c757d',
        success: '#198754',
        info: '#0dcaf0',
        warning: '#ffc107',
        danger: '#dc3545',
        light: '#f8f9fa',
        dark: '#212529',
        black: '#000',
        white: '#fff',
        'body-color': '#212529',
        gray: {
          100: '#f8f9fa',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          '"Noto Sans"',
          '"Liberation Sans"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        monospace: [
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};
