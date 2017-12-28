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
    gulp.watch("index.css", function () {
        gulp
            .src("index.css")
            .pipe(cleanCss())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest("./"))
            .pipe(connect.reload());
    });
    gulp.watch("index.js", function () {
        gulp
            .src("index.js")
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest("./"))
            .pipe(connect.reload());
    });
});

gulp.task("default", ["watch", "localhost"]);