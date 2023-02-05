// "use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const serve = require("browser-sync").create();
const cssnano = require("cssnano");
const concat = require('gulp-concat');
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
var sass = require('gulp-sass')(require('sass'));
const  livereload = require('gulp-livereload');
const notify = require('gulp-notify');
var reload = serve.reload;



gulp.task('connect', function (done) {
  connect.server({
      root: 'build',
      livereload: true,
      port: 3000
  });

  done();
});


// == Browser-sync task
gulp.task("browser-sync", function(done){
  serve.init({
    server: "./",
    startPath: "./webpage",
    
    // After it browser running [File path set]
    //    browser: 'chrome',
    host: 'localhost',
    livereload: true,
    port: 3000,
      //  port: 4000,
    open: true,
    // tunnel: true
  });
  gulp.watch(["./**/*.html"]).on("change", reload); // [File path set]
  done(); 
});


// CSS task
gulp.task("css", () => {
  return gulp
    .src("assets/scss/app.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("public/css"))
    .pipe(notify({
          message: "main SCSS processed"
    }))
    .pipe(serve.stream())
    .pipe(livereload())
});

// Webfonts task

gulp.task("webfonts", () => {
  return gulp
    .src("assets/scss/app-vendor/fonts/webfonts/*.{ttf,woff,woff2,eot,svg}")
    .pipe(gulp.dest('./public/css/webfonts'));
});

// Transpile, concatenate and minify scripts
gulp.task("js", () => {
  return (
    gulp
      .src([
      'assets/js/jquery-3.6.0.min.js',      
      'assets/js/popper.min.js', 
      'assets/js/bootstrap.min.js',
      'assets/js/select2.min.js',
      'assets/js/main-js/main.js',
      'assets/js/other-js/*.js',
      
    ])
      .pipe(plumber())

      // folder only, filename is specified in webpack config
      .pipe(concat('app.js'))
      .pipe(gulp.dest("public/js"))
      .pipe(serve.stream())
      .pipe(livereload())
  );
});

gulp.task("default", gulp.series( "css", "js", "webfonts", "browser-sync", () => {
  livereload.listen();
  gulp.watch(["assets/scss/**/*"], gulp.series("css"));
  gulp.watch(["assets/js/**/*"], gulp.series("js"));
  gulp.watch(["assets/scss/app-vendor/fonts/webfonts/*"], gulp.series("webfonts"));
}));





