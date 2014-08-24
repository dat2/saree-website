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
    js: ['src/app/**/*.js', '!src/app/**/*.spec.js'],
    jsunit: ['src/app/**/*.spec.js'],

    atpl: ['src/app/views/**/*.html'],
    ctpl: ['src/app/components/**/*.html'],

    html: ['src/index.html'],

    sass: 'src/app/{,**/}*.scss'
  },

  testFiles: {
    js: [
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-scenario/angular-scenario.js'
    ]
  }
};
