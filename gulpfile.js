const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const wait = require("gulp-wait");
const open = require("gulp-open");
const livereload = require("gulp-livereload");
// Task to minify css using package cleanCSs
gulp.task("minify-css", function () {
  return gulp
    .src("css/main.css")
    .pipe(cleanCSS())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("css/"))
    .pipe(wait(500))
    .pipe(open({ uri: "http://reload.extensions" }));
  //https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid
});
gulp.task("watch", function () {
  gulp.watch(["css/*.css", "css/dark/*.css", "!css/*.min.css"], gulp.series(["minify-css"]));
});

//Default
gulp.task("default", gulp.series(["watch"]));
