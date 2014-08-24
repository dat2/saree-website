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
    .pipe(g.minifyCss()) //ugh removes the source map
    .pipe(g.concat('app-built.css'))
    .pipe(gulp.dest(config.prodDir + '/css'));
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
    .pipe(g.if(production, gulp.dest(config.prodDir + '/js'), gulp.dest(config.devDir)));
}

gulp.task('partials-app', function() {
  makePartial(config.appFiles.atpl, 'app', 'views/');
});

gulp.task('partials-components', function() {
  makePartial(config.appFiles.ctpl, 'components', 'components/');
});

gulp.task('partials', ['partials-app', 'partials-components']);

gulp.task('partials-app:dist', function() {
  makePartial(config.appFiles.atpl, 'app', 'views/', true);
});

gulp.task('partials-components:dist', function() {
  makePartial(config.appFiles.ctpl, 'components', 'components/', true);
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

/**
 * Server tasks
 */
var browserSync = require('browser-sync'),
  reload = browserSync.reload;

function createNodemon(production, cb) {
  var called = false;
  g.nodemon({
    script: 'server/index.js',
    env: {
      'NODE_ENV': production ? 'production' : 'development'
    }
  }).on('start', function() {
    if (!called) {
      called = true;
      cb();
    }
  });
}

gulp.task('nodemon', function(cb) {
  createNodemon(false, cb);
});
//run a local server
gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init({
    proxy: 'localhost:3000',

    port: 9000,
    online: false,
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
var path = require('path');
var images = 'client/src/images/*';

gulp.task('copy-images', function() {
  return gulp.src(images)
    .pipe(gulp.dest(config.devDir + '/images'));
});

gulp.task('copy-images:dist', function() {
  return gulp.src(images)
    .pipe(gulp.dest(config.prodDir + '/images'));
});

var fonts = mainBowerFiles()
  .filter(function(filename) {
    var ext = path.extname(filename);

    var extensions = ['.eot','.svg','.ttf','.woff'];
    return extensions.indexOf(ext) > -1;
  });

gulp.task('copy-fonts:dist', function() {
  return gulp.src(fonts)
    .pipe(gulp.dest(config.prodDir + '/fonts'));
});

var path = require('path');
var copyFiles = [
  'client/src/404.html',
  'client/src/favicon.ico',
  'client/src/robots.txt',
];

gulp.task('copy', ['copy-images'], function() {
  return gulp.src(copyFiles)
    .pipe(gulp.dest(config.devDir));
});

gulp.task('copy:dist', ['copy-images:dist', 'copy-fonts:dist'], function() {
  return gulp.src(copyFiles)
    .pipe(gulp.dest(config.prodDir));
});

/**
 * Build tasks
 */
var header = require('gulp-header'),
  footer = require('gulp-footer');

var moment = require('moment'),
  fs = require('fs'),
  path = require('path');

gulp.task('build-vendor-js', function() {
  return gulp.src(mainBowerFiles().filter(function(filename) {
      return path.extname(filename) === '.js';
    }))
    .pipe(g.concat('vendor-built.js'))
    // .pipe(g.uglify())
    .pipe(gulp.dest(config.prodDir + '/js'));
});

//g.concatenate, g.ngAnnotate, g.uglify, header, footer, source maps
gulp.task('build-app-js', ['lint'], function() {
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
    .pipe(g.sourcemaps.write('.'))
    .pipe(gulp.dest(config.prodDir + '/js'));
});

gulp.task('build:js', ['build-app-js', 'build-vendor-js']);

gulp.task('build-vendor-css', function() {
  return gulp.src(mainBowerFiles().filter(function(filename) {
      return path.extname(filename) === '.css';
    }))
    .pipe(g.concat('vendor-built.css'))
    // .pipe(g.uglify())
    .pipe(gulp.dest(config.prodDir + '/css'));
});

gulp.task('build:css', ['sass:dist', 'build-vendor-css']);

gulp.task('index:dist', ['build:js', 'build:css', 'partials:dist'], function() {
  return gulp.src(config.appFiles.html)
    .pipe(g.inject(
      gulp.src(
        [
          config.prodDir + '/css/app-built.css',
          config.prodDir + '/js/app-built.js'
        ], {
          read: false
        }), {
        starttag: '<!-- app:{{ext}} -->',
        addRootSlash: false,
        ignorePath: [config.prodDir]
      }))
    .pipe(g.inject(
      gulp.src(
        templateJs
        .map(function(filename) {
          return filename.replace(config.devDir, config.prodDir + '/js/');
        }), {
          read: false
        }), {
        starttag: '<!-- templates -->',
        addRootSlash: false,
        ignorePath: [config.prodDir]
      }
    ))
    .pipe(g.inject(
      gulp.src(
        [
          config.prodDir + '/js/vendor-built.js',
          config.prodDir + '/css/vendor-built.css'
        ], {
          read: false
        }), {
        starttag: '<!-- bower:{{ext}} -->',
        addRootSlash: false,
        ignorePath: [config.prodDir]
      }))
    .pipe(gulp.dest(config.prodDir));
});

gulp.task('build', ['clean', 'index:dist', 'copy:dist']);

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
