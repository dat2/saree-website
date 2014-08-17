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
        js: ['src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js'],
        jsunit: ['src/**/*.spec.js'],

        atpl: ['src/app/**/*.tpl.html'],
        ctpl: ['src/common/**/*.tpl.html'],

        html: ['src/index.html'],

        less: 'src/styles/main.less',
        sass: 'src/styles/main.scss'
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
            'bower_components/angular-resource/angular-resource.js'
        ],
        css: [],
        assets: []
    },
};