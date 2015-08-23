var gulp = require('gulp');
var path = require('path');
var babel = require('gulp-babel');
var config = require('../config');

gulp.task('babel', function() {
  gulp.src(path.join(config.src.root, 'server.js'))
    .pipe(babel())
    .pipe(gulp.dest(config.dest.root));
});
