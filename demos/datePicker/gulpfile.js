'use strict';

// sass compile
var gulp = require('gulp');
var prettify = require('gulp-prettify');
var cleanCss = require("gulp-clean-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var rtlcss = require("gulp-rtlcss");
var connect = require('gulp-connect');

gulp.task("localhost", function () {
    connect.server({
        livereload: true,
        port: 2017
    });
});

gulp.task("watch", function () {
    gulp.watch("*.html", function () {
        gulp
            .src("*.html")
            .pipe(connect.reload());
    });
    gulp.watch(["*.css", "!*.min.css"], function () {
        gulp
            .src(["*.css", "!*.min.css"])
            .pipe(cleanCss())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest("./"))
            .pipe(connect.reload());
    });
    gulp.watch(["*.js", "!*.min.js", "!gulpfile.js"], function () {
        gulp
            .src(["*.js", "!*.min.js", "!gulpfile.js"])
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest("./"))
            .pipe(connect.reload());
    });
});

gulp.task("default", ["watch", "localhost"]);