/**
 * Common gulp imports
 */
var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),

    ngAnnotate = require('gulp-ng-annotate');

/**
 * npm modules
 */
var lazypipe = require('lazypipe');

/**
 * Common variables
 */
var config = require('./build.config.js'),
    production = false,
    compileDirectory = lazypipe()
    .pipe(function() {
        return gulpif(production, gulp.dest(config.prodDir), gulp.dest(config.devDir));
    });

/**
 * CSS preprocessing (LESS)
 */
var sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css');

gulp.task('sass', function() {
    return gulp.src(config.appFiles.sass)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(gulpif(production, minifyCSS()))
        .pipe(sourcemaps.write('.'))
        .pipe(compileDirectory());
});

/**
 * Clean task
 */
var del = require('del');
gulp.task('clean', function(done) {
    del.sync([config.devDir, config.prodDir]);
    done();
});

/**
 * Partial tasks
 */
var ngHtml2Js = require('gulp-ng-html2js'),
    htmlmin = require('gulp-htmlmin');

var annotateAndUglify = lazypipe()
    .pipe(ngAnnotate)
    .pipe(uglify);

/**
 * Partial pipe factory
 * This will
 * a. minify your templates (passed in from gulp.src)
 * b. convert them to angular modules using html2js
 * c. concatenate
 * d. ngAnnotate
 * e. uglify
 * @return stream
 */
function makePartialPipe(name) {
    return lazypipe()
        .pipe(function() {
            return gulpif(production, htmlmin({
                collapseWhitespace: true
            }));
        })
        .pipe(ngHtml2Js, {
            moduleName: 'templates-' + name
        })
        .pipe(concat, 'templates-' + name + '.js')
        .pipe(function() {
            return gulpif(production, annotateAndUglify());
        })();

    //this is immediately called for api reasons
    //otherwise, the user would have to type makePartialPipe(<name>)()
    //since lazy pipe returns a stream factory function
}

function makePartial(fileGlob, partialName) {
    return gulp.src(fileGlob)
        .pipe(makePartialPipe(partialName))
        .pipe(compileDirectory());
}

gulp.task('partials-app', function() {
    makePartial(config.appFiles.atpl, 'app');
});

gulp.task('partials-common', function() {
    makePartial(config.appFiles.ctpl, 'common');
});

gulp.task('partials', ['partials-app', 'partials-common']);

/**
 * Lint tasks
 */
var jshint = require('gulp-jshint');

var stylish = require('jshint-stylish');

var lint = lazypipe()
    .pipe(jshint)
    .pipe(jshint.reporter, stylish)
    .pipe(jshint.reporter, 'fail');

gulp.task('lint', function() {
    return gulp.src(config.appFiles.js)
        .pipe(lint());
});

gulp.task('lint-unit', function() {
    return gulp.src(config.appFiles.jsunit)
        .pipe(lint());
});

/**
 * Template processing
 */
var template = require('gulp-template'),
    rename = require('gulp-rename');

var globArray = require('glob-array'),
    pkg = require('./package.json');

var templateJs = ['templates-app.js', 'templates-common.js'];

gulp.task('process-index', function() {
    var vendorJs = production ? ['vendor-built.js'] : config.vendorFiles.js;

    var appJs = production ? ['app-built.js'] : globArray.sync(config.appFiles.js);

    return gulp.src(config.appFiles.html)
        .pipe(template({
            vendorJs: vendorJs,
            appJs: appJs,
            templateJs: templateJs,

            css: 'main.css',
            version: pkg.version
        }))
        .pipe(compileDirectory());
});

gulp.task('process-karma', function() {
    var appJs = config.vendorFiles.js
        .concat(
            templateJs.map(function(filename) {
                return config.devDir + '/' + filename;
            })
        )
        .concat(config.testFiles.js);

    return gulp.src('karma/karma-unit.tpl.js')
        .pipe(template({
            scripts: appJs
        }))
        .pipe(rename('karma-unit.js'))
        .pipe(gulp.dest(config.devDir));
});

/**
 * Server tasks
 */
var browserSync = require('browser-sync'),
    reload = browserSync.reload;

//run a local server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            //ORDER MATTERS
            baseDir: [config.devDir, '.']
        },

        online: false,

        port: 9000,
        open: false
    });
});

gulp.task('serve', ['clean', 'sass', 'browser-sync', 'partials', 'process-index'], function() {
    gulp.start('test');

    //watch sass files
    gulp.watch('src/**/*.scss', ['sass', reload]);

    //watch index.html and re-process it
    gulp.watch(config.appFiles.html, ['process-index', reload]);

    //watch templates
    gulp.watch([config.appFiles.atpl, config.appFiles.ctpl], ['partials', reload]);

    //watch js
    gulp.watch(config.appFiles.js, reload);

    //watch specs, and lint them
    gulp.watch(config.appFiles.jsunit, ['lint-unit']);
});

/**
 * Build tasks
 */
var header = require('gulp-header'),
    footer = require('gulp-footer');

var moment = require('moment'),
    fs = require('fs');

//concatenate, ngAnnotate, uglify, header, footer, source maps
gulp.task('build-app-js', ['lint'], function() {
    var date = moment();
    return gulp.src(config.appFiles.js)
        .pipe(sourcemaps.init())
        .pipe(concat('app-built.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(header(fs.readFileSync('module.prefix'), {
            pkg: pkg,
            today: function today(string) {
                return date.format(string);
            }
        }))
        .pipe(footer(fs.readFileSync('module.suffix')))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.prodDir));
});

//concatenate, uglify
gulp.task('build-vendor-js', function() {
    return gulp.src(config.vendorFiles.js)
        .pipe(concat('vendor-built.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.prodDir));
});

gulp.task('build-js', ['build-app-js', 'build-vendor-js']);

//can't specify less as a dependency since it would get run before setting production to false
gulp.task('build-css', function(done) {
    production = true;

    gulp.start('sass');

    done();
});

gulp.task('build', ['clean'], function() {
    gulp.start('build-js');
    gulp.start('build-css');
    gulp.start('partials');
    gulp.start('process-index');
});

/**
 * Test tasks
 */
var karma = require('karma').server;

gulp.task('test', ['process-karma'], function(done) {
    var conf = require('./' + config.devDir + '/karma-unit.js');
    karma.start(conf, done);
});
