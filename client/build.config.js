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

    sass: 'src/app/**.scss'
  },

  testFiles: {
    js: [
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-scenario/angular-scenario.js'
    ]
  },

  vendorFiles: {
    js: [
      'bower_components/angular/angular.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js'
    ],
    css: [],
    assets: []
  },
};
