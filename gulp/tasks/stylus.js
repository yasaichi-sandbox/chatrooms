var gulp = require('gulp');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var stylus = require('gulp-stylus');
var minifyCss = require('gulp-minify-css');
var config = require('../config');

gulp.task('stylus', function() {
  gulp.src(path.join(config.src.assets, 'stylesheets/main.styl'))
    .pipe(sourcemaps.init())
    .pipe(stylus({
      compress: true,
      'include css': true
    }))
    .pipe(minifyCss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.join(config.dest.assets, 'stylesheets')));
});
