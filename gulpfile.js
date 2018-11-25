const gulp = require('gulp');
      del = require('del');
      uglify = require('gulp-uglify');
      cleanCSS = require('gulp-clean-css');
      rename = require('gulp-rename');
      maps = require('gulp-sourcemaps');
      watch = require('gulp-watch');
      sass = require('gulp-sass');
 
sass.compiler = require('node-sass');

// compile sass
gulp.task('sass', function () {
    return gulp.src('./style.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./css'));
  });
   
gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

// // minify scripts 
// gulp.task('minify-scripts', function() {
//     return gulp.src('./app.js')
//         .pipe(uglify())
//         .pipe(rename('app.min.js'))
//         .pipe(gulp.dest('./dist/scripts'));
// });

// // minify CSS
// gulp.task('minify-css', function() {
//     return gulp.src('./css/style.css')
//         .pipe(cleanCSS())
//         .pipe(rename('style.min.css'))
//         .pipe(gulp.dest('./dist/styles'));
// });

// // watch files
// gulp.task('watch', function() {
//    gulp.watch('./*.js', './*.css'); 
// });

// // clean
// gulp.task('clean', function() {
//     del('./dist')
// });

// build
gulp.task('build', ['sass']);

gulp.task('default', function() {
   gulp.start('build'); 
});