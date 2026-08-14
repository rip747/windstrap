module.exports = (ctx) => ({
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
    // `postcss ... --env production` enables cssnano (used by the build:min step)
    ...(ctx.env === 'production' ? { cssnano: {} } : {}),
  },
});
