var gulp = require('gulp')
var plumber = require('gulp-plumber')
var sass = require('gulp-sass')


gulp.task('sass', function () {
	gulp.src('public/stylesheets/style.scss')
	.pipe(plumber())
	.pipe(sass())
	.pipe(gulp.dest('./public/stylesheets'))
})

gulp.task('watch', function () {
	gulp.watch('public/stylesheets/*.scss', ['sass'])
})

gulp.task('default', ['sass', 'watch'])