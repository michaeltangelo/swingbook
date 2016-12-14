/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp');
// var gutil = require('gulp-util');
var concat = require('gulp-concat');
// var babel = require('gulp-babel');
// var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('default', ['babel'], function () {
  gulp.watch('./app/**/*.js', ['babel']);
});

gulp.task('babel', () => {
    return gulp.src('./app/**/*.js')
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        // .pipe(uglify())
        .pipe(gulp.dest('dist'));
});
