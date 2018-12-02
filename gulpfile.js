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
gulp.task('sass', () =>  {
    return gulp.src('./style.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./css'));
  });

// watch sass files
gulp.task('watch', () => gulp.watch('./style.scss', ['sass']));

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

// // clean
// gulp.task('clean', function() {
//     del('./dist')
// });

// build
gulp.task('build', ['sass']);

gulp.task('default', () => gulp.start('build'));