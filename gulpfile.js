/**
 * Common gulp imports
 */
var gulp = require('gulp'),
  g = require('gulp-load-plugins')({
    lazy: false
  });

/**
 * npm modules
 */
var lazypipe = require('lazypipe');

/**
 * Common variables
 */
var config = require('./build.config.js');

/**
 * CSS preprocessing (Sass)
 */

gulp.task('sass', function() {
  return gulp.src(config.appFiles.sass)
    //.pipe(g.sourcemaps.init())
    .pipe(g.sass({
      sourceComments: 'map'
    }))
    .pipe(g.flatten())
    // .pipe(g.sourcemaps.write('.'))
    .pipe(gulp.dest(config.devDir));
});

gulp.task('sass:dist', function() {
  return gulp.src(config.appFiles.sass)
    .pipe(g.sass({
      sourceComments: 'map'
    }))
    .pipe(g.minifyCss())
    .pipe(g.concat('app-built.css'))
    .pipe(gulp.dest(config.prodDir));
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
var annotateAndUglify = lazypipe()
  .pipe(g.ngAnnotate)
  .pipe(g.uglify);

function makePartial(fileGlob, name, prefix, production) {
  return gulp.src(fileGlob)
    .pipe(g.if(production, g.htmlmin({
      collapseWhitespace: true
    })))
    .pipe(g.ngHtml2js({
      moduleName: 'templates-' + name,
      prefix: prefix
    }))
    .pipe(g.concat('templates-' + name + '.js'))
    .pipe(g.if(production, annotateAndUglify()))
    .pipe(g.if(production, gulp.dest(config.prodDir), gulp.dest(config.devDir)));
}

gulp.task('partials-app', function() {
  makePartial(config.appFiles.atpl, 'app', 'views/');
});

gulp.task('partials-components', function() {
  makePartial(config.appFiles.ctpl, 'components', 'components/');
});

gulp.task('partials', ['partials-app', 'partials-components']);

gulp.task('partials-app:dist', function() {
  makePartial(config.appFiles.atpl, 'app', 'views', true);
});

gulp.task('partials-components:dist', function() {
  makePartial(config.appFiles.atpl, 'components', 'components/', true);
});

gulp.task('partials:dist', ['partials-app:dist', 'partials-components:dist']);

/**
 * Lint tasks
 */
var jshint = require('gulp-jshint');

var stylish = require('jshint-stylish');

var lint = lazypipe()
  .pipe(jshint)
  .pipe(jshint.reporter, stylish);

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
var mainBowerFiles = require('main-bower-files');

var pkg = require('./package.json');

var templateJs = ['templates-app.js', 'templates-components.js']
  .map(function(filename) {
    return config.devDir + '/' + filename;
  });

gulp.task('index', ['sass', 'partials'], function() {
  return gulp.src(config.appFiles.html)
    .pipe(g.inject(
      gulp.src(
        [config.devDir + '/*.css']
        .concat(config.appFiles.js), {
          read: false
        }), {
        starttag: '<!-- app:{{ext}} -->',
        addRootSlash: false,
        ignorePath: [config.devDir, 'client']
      }
    ))
    .pipe(g.inject(
      gulp.src(templateJs, {
        read: false
      }), {
        starttag: '<!-- templates -->',
        addRootSlash: false,
        ignorePath: [config.devDir, 'client']
      }
    ))
    .pipe(g.inject(
      gulp.src(mainBowerFiles(), {
        read: false
      }), {
        starttag: '<!-- bower:{{ext}} -->',
        addRootSlash: false,
        ignorePath: ['client']
      }))
    .pipe(gulp.dest(config.devDir));
});

gulp.task('index:dist', function() {

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
      baseDir: [config.devDir, 'client']
    },

    online: false,

    port: 9000,
    open: false
  });
});

// Note: this does not catch new files, I currently can't figure out how to watch new files
// very nicely.
gulp.task('serve', ['clean', 'copy', 'browser-sync', 'index'], function() {
  //watch sass files
  gulp.watch('src/**/*.scss', ['sass', reload]);

  //watch index.html and re-process it
  //since index depends on sass and partials, this will
  //recompile a lot
  gulp.watch(config.appFiles.html, ['index', reload]);

  //watch templates
  gulp.watch([config.appFiles.atpl, config.appFiles.ctpl], ['partials', reload]);

  //watch js
  gulp.watch(config.appFiles.js, reload);

  //watch specs, and lint them
  gulp.watch(config.appFiles.jsunit, ['lint-unit']);
});

/**
 * Copy tasks
 */
var copyFiles = ['src/404.html', 'src/favicon.ico', 'src/robots.txt'];

gulp.task('copy', function() {
  return gulp.src(copyFiles)
    .pipe(gulp.dest(config.devDir));
});

gulp.task('copy:dist', function() {
  return gulp.src(copyFiles)
    .pipe(gulp.dest(config.prodDir));
});

/**
 * Build tasks
 */
var header = require('gulp-header'),
  footer = require('gulp-footer');

var moment = require('moment'),
  fs = require('fs');

//g.concatenate, g.ngAnnotate, g.uglify, header, footer, source maps
gulp.task('build:js', ['lint'], function() {
  var date = moment();
  return gulp.src(config.appFiles.js)
    .pipe(g.sourcemaps.init())
    .pipe(g.concat('app-built.js'))
    .pipe(g.ngAnnotate())
    .pipe(g.uglify())
    .pipe(header(fs.readFileSync('module.prefix'), {
      pkg: pkg,
      today: function today(string) {
        return date.format(string);
      }
    }))
    .pipe(footer(fs.readFileSync('module.suffix')))
    .pipe(g.sourcemaps.write())
    .pipe(gulp.dest(config.prodDir));
});

//can't specify less as a dependency since it would get run before setting production to false
gulp.task('build:css', ['sass:dist']);

gulp.task('build', ['clean', 'build:js', 'build:css', 'partials:dist', 'index:dist', 'copy:dist']);

/**
 * Test tasks
 */
var karma = require('karma').server;

gulp.task('karma', function() {
  var js = mainBowerFiles()
    .concat(templateJs)
    .concat(config.testFiles.js);

  return gulp.src('client/karma/karma-unit.tpl.js')
    .pipe(g.inject(
      gulp.src(js, {
        read: false
      }), {
        addRootSlash: false,
        starttag: '// inject:{{ext}}',
        endtag: '// endinject',
        transform: function(filepath) {
          return '\'' + filepath + '\',';
        },
        ignorePath: config.devDir
      }))
    .pipe(g.rename('karma-unit.js'))
    .pipe(gulp.dest(config.devDir));
});

gulp.task('test', ['karma'], function(done) {
  var conf = require('./' + config.devDir + '/karma-unit.js');
  karma.start(conf, done);
});
