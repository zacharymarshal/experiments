const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
    purgecss({
      content: ['public/index.html'],
    }),
    require('cssnano')({
      preset: 'default',
    }),
  ]
}
