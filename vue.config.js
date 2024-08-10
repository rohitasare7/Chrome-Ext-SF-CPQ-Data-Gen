const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    'index': {
      entry: './src/main.js',
      template: 'public/index.html',
      title: 'Home',
      chunks : ['chunk-vendors','chunk-common','index']
    },
    'app': {
      entry: './src/SecondaryPage.js',
      template: 'public/app.html',
      title: 'App',
      chunks : ['chunk-vendors','chunk-common','app']
    },
  }
})
