var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('scripts', function() {
  gulp.src('./js/*.js')
    .pipe(concat("sadui.js"))
    .pipe(gulp.dest('./dist/js/'))
});