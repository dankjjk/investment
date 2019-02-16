var gulp 		 	   = require('gulp'),
		browserSync  = require('browser-sync').create(),
		pug					 = require('gulp-pug'),
		sass 		 	   = require('gulp-sass'),
		rimraf 			 = require('rimraf'),
		rename			 = require('gulp-rename'),
		autoprefixer = require('gulp-autoprefixer'),
		sourcemaps	 = require('gulp-sourcemaps'),
		postcss			 = require('gulp-postcss'),
		uglify			 = require('gulp-uglify'),
		concat			 = require('gulp-concat');
		imagemin		 = require('gulp-imagemin');


/* --------------- BrowserSync --------------- */

gulp.task('server', function() {
	browserSync.init({
		server: {
			port: 3000,
			baseDir: "dist"
		}
	});

	gulp.watch('dist/**/*').on('change', browserSync.reload);
});

/* --------------- Html compile --------------- */

gulp.task('templates:compile', function () {
  return gulp.src('src/*.html')
  .pipe(gulp.dest('dist'));
});


/* --------------- Sass compile --------------- */

gulp.task('sass:compile', function () {
  return gulp.src('src/scss/main.scss')
  	.pipe(sourcemaps.init())
  	.pipe(sass({outputStyle: 'uncompressed'}).on('error', sass.logError))
  	.pipe(autoprefixer({
  		browsers: ['last 2 versions'],
  		cascade: false }))
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css/'));
});


/* --------------- JS compile --------------- */

gulp.task('js:compile', function() {
	return gulp.src([
			'src/js/main.js',
		])
		.pipe(sourcemaps.init())
		.pipe(concat('main.min.js'))
		.pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('dist/js'))
});


/* ---------------  Images compress --------------- */

gulp.task('img:compress', function() {
	return gulp.src('src/img/**/*.*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
});


/* --------------- Delete --------------- */

gulp.task('clean', function del(cb) {
	return rimraf('dist/', cb);
});


/* --------------- Copy fonts --------------- */

gulp.task('copy:fonts', function() {
	return gulp.src('src/fonts/**/*.*')
		.pipe(gulp.dest('dist/fonts'));
});


/* --------------- Copy js-libs --------------- */

gulp.task('copy:js-libs', function() {
	return gulp.src('src/js/libs/*.js')
		.pipe(gulp.dest('dist/js'));
});


/* --------------- Copy video-bg --------------- */

gulp.task('copy:video-bg', function() {
	return gulp.src('src/video/**/*.*')
		.pipe(gulp.dest('dist/video'));
});


/* --------------- Copy --------------- */

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:js-libs', 'copy:video-bg'));


/* --------------- Watchers --------------- */

gulp.task('watch', function () {
  gulp.watch('src/*.html', gulp.series('templates:compile'));
  gulp.watch('src/scss/**/*.scss', gulp.series('sass:compile'));
  gulp.watch('src/js/**/*.js', gulp.series('js:compile'));
  gulp.watch('src/img/**/*.*', gulp.series('img:compress'));
});


/* --------------- Default --------------- */

gulp.task('default', gulp.series(
	'clean',
	gulp.parallel('templates:compile', 'sass:compile', 'js:compile', 'img:compress', 'copy'),
	gulp.parallel('watch', 'server')
	)
);