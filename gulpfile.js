var gulp = require("gulp"),
    sass = require("gulp-sass"),
    browserSync = require("browser-sync").create(),
    useref = require("gulp-useref"),
    gulpIf = require("gulp-if"),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    jsonminify = require('gulp-jsonminify'),
    del = require("del"),
    runSequence = require("run-sequence"),
    autoprefixer = require("gulp-autoprefixer"),
    babel = require("gulp-babel"),
    jshint = require('gulp-jshint');
    

/* ---------------
tasks
--------------- */
gulp.task("sass", function(){
  return gulp.src("app/scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.reload({
      stream: true
  }))
});

gulp.task("browserSync", function(){
  browserSync.init({
    server: {
      baseDir: "app"
    },
  })
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', babel({
      presets: ['es2015']
    })))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulpIf('*.css', autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('json', function () {
  return gulp.src(['app/json/**/*.json'])
    .pipe(jsonminify())
    .pipe(gulp.dest('dist/json'));
});

//delete dist folder
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

//clean and build dist
gulp.task('build', function (callback) {
  runSequence('clean:dist', 'sass', [ 'useref', 'images', 'fonts'], callback)
})

//clean and build more specific to current project
gulp.task('buildsp', function (callback) {
  runSequence('clean:dist', 'sass', [ 'useref', 'images', 'fonts', 'json'], callback)
})

//clear cache
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task("jshint", function() {
  gulp.src("./app/js/main.js")
  .pipe(jshint())
  .pipe(jshint.reporter("default"))
});


/* ---------------
watch
--------------- */
gulp.task("watch", function(){
  gulp.watch("app/scss/**/*.scss", ["sass"]);
  gulp.watch("app/*html", browserSync.reload);
  gulp.watch("app/js/**/*.js", browserSync.reload);
  gulp.watch("app/json/**/*.js", browserSync.reload);
});


/* ---------------
default
--------------- */
gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'], callback)
})




