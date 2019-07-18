"use strict";

// Load plugins
const browsersync = require("browser-sync").create();
const del = require("del");
const gulp = require("gulp");
const merge = require("merge-stream");
var nodemon = require('gulp-nodemon');

// BrowserSync
function browserSync() {
  browsersync.init({
    port: 3001,
    proxy: {
      target: 'localhost:3000',
      ws:true,
    },
    browser: "firefox",
  });
}

function nodemon(done) {
  nodemon({
      script: './bin/www'
    })
    .on('start', function () {
      done();
    })
    .on('error', function(err) {
     // Make sure failure causes gulp to exit
     throw err;
   });
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["public/vendor/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Bootstrap
  var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('public/vendor/bootstrap'));
  // jQuery
  var jquery = gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('public/vendor/jquery'));
  return merge(bootstrap, jquery);
}


// Watch files
function watchFiles() {
  gulp.watch("./**/*.css", browserSyncReload);
  gulp.watch("./**/*.html", browserSyncReload);
  gulp.watch("./**/*.ejs", browserSyncReload);
}

// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync, nodemon));

// Export tasks
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
