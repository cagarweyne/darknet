
exports.config = {
 npm: {
   enabled: true
 },

 plugins: {
   babel: {
     presets: ['es2015', 'react'],
     pattern: /\.(es6|jsx|js)$/
   }
 },

 files: {
   javascripts: {
     joinTo: 'javascripts/app.js'
   },
   stylesheets: {
     joinTo: 'stylesheets/app.css'
   }
 }
};
