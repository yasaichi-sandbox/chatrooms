var gulp = require('gulp');
var path = require('path');
var jade = require('gulp-jade');
var config = require('../config');

gulp.task('jade', function() {
  gulp.src(path.join(config.src.assets, 'index.jade'))
    .pipe(jade())
    .pipe(gulp.dest(config.dest.assets));
});
