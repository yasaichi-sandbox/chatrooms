'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const jade = require('gulp-jade');
const stylus = require('gulp-stylus');
const minifyCss = require('gulp-minify-css');
const sourcemaps = require('gulp-sourcemaps');

const browserifyOptions = {
  entries: ['./app/javascripts/chat.js', './app/javascripts/chat_ui.js'],
  transform: [babelify],
  debug: true
};

function bundleScriptsBy(bundler) {
  bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/javascripts'));
}

gulp.task('browserify', () => {
  const bundler = browserify(browserifyOptions);
  bundleScriptsBy(bundler);
});

gulp.task('watchify', () => {
  const options = Object.assign({}, watchify.args, browserifyOptions);
  const bundler = watchify(browserify(options));

  bundler.on('log', gutil.log);
  bundler.on('update', () => bundleScriptsBy(bundler));

  bundleScriptsBy(bundler);
});

gulp.task('jade', () => {
  gulp.src('./app/index.jade')
    .pipe(jade())
    .pipe(gulp.dest('./public'));
});

gulp.task('stylus', () => {
  gulp.src('./app/stylesheets/main.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
      compress: true,
      'include css': true
    }))
    .pipe(minifyCss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('build', ['browserify', 'jade', 'stylus']);

gulp.task('watch', ['watchify', 'jade', 'stylus'], () => {
  gulp.watch('./app/**/*.jade', ['jade']);
  gulp.watch('./app/stylesheets/*.styl', ['stylus']);
});

gulp.task('default', ['watch']);
