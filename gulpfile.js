const DEST_PATH = './'
const PORT = process.env.PORT || 2020;

// Scripts
var browserify = require('gulp-browserify');
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var reactify = require('coffee-reactify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
  gulp.src('src/index.coffee', { read: false })
    .pipe(plumber())
    .pipe(browserify({
      debug: false,
      transform: [reactify],
      extensions: ['.coffee, .cjsx']
    }))
    .pipe(uglify())
    .pipe(rename('index.js'))
    .pipe(gulp.dest(DEST_PATH))
    .pipe(livereload());
});

// Styles
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

gulp.task('styles', function() {
  gulp.src('src/index.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 4 versions', 'Firefox ESR', 'Opera 12.1']
    }))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest(DEST_PATH))
    .pipe(livereload());
});

// Server
var http = require('http');
var express = require('express');
var ecstatic = require('ecstatic');

gulp.task('server', function() {
  var app = express();
  app.use(ecstatic({ root: __dirname }));
  http.createServer(app).listen(PORT);

  console.log('Static server listening on :'+PORT);
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('src/index.coffee', ['scripts']);
  gulp.watch('src/components/**/*.cjsx', ['scripts']);
  gulp.watch(['src/***/**/*.scss', 'src/index.scss'], ['styles']);
});

// Default
gulp.task('default', ['scripts', 'styles', 'watch', 'server']);
