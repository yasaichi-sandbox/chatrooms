'use strict';

const gulp = require('gulp');
const jade = require('gulp-jade');
const stylus = require('gulp-stylus');
const minifyCss = require('gulp-minify-css');
const sourcemaps = require('gulp-sourcemaps');

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

gulp.task('watch', ['jade', 'stylus'], () => {
  gulp.watch('./app/**/*.jade', ['jade']);
  gulp.watch('./app/stylesheets/*.styl', ['stylus']);
});

gulp.task('default', ['watch']);
