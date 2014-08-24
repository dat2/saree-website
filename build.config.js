/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The devDir is where all the temporary files that need preprocessing
   * go, the prodDir is where the built output goes.
   */
  devDir: '.tmp',
  prodDir: 'dist',

  appFiles: {
    js: ['client/src/app/**/*.js', '!client/src/app/**/*.spec.js'],
    jsunit: ['client/src/app/**/*.spec.js'],

    atpl: ['client/src/app/views/**/*.html'],
    ctpl: ['client/src/app/components/**/*.html'],

    html: ['client/src/index.html'],

    sass: 'client/src/app/{,**/}*.scss'
  },

  testFiles: {
    js: [
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/bower_components/angular-scenario/angular-scenario.js'
    ]
  }
};
