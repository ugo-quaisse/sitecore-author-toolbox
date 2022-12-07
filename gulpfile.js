/* eslint-disable array-element-newline */
/* eslint-disable no-undef */
const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
// Task to minify css using package cleanCSs
gulp.task("minify-css", function () {
  return gulp
    .src(["css/main.css", "css/experienceeditor.css"])
    .pipe(cleanCSS())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("css/"));
});
gulp.task("watch", function () {
  gulp.watch(["css/*.css", "css/dark/*.css", "!css/*.min.css"], gulp.series(["minify-css"]));
});

//Default
gulp.task("default", gulp.series(["watch"]));
