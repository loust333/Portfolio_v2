var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var concatCss = require('gulp-concat-css');


// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src(['less/freelancer.less', 'less/custom.less'])
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src(['css/freelancer.css', 'css/custom.css', 'css/fontMontSerrat.css'])
        .pipe(cleanCSS({ keepSpecialComments : 0, compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src(['js/freelancer.js', 'js/contact_me.js', 'js/jqBootstrapValidation.js', 'js/jquery.easing.1.3.js'])
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('vendor/bootstrap'));

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('vendor/jquery'));

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('vendor/font-awesome'));
});


//Minify html
gulp.task('minify', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      collapseBooleanAttributes: true,
      decodeEntities: true,
      html5: true,
      minifyCSS: true,
      minifyJS: true,
      processConditionalComments: true,
      processScripts: "text/html",
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
    	removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeTagWhitespace: true,
      sortAttributes: true,
      sortClassName: true,
      trimCustomFragments: true,
      useShortDoctype: true}))
    .pipe(gulp.dest(''));
});

gulp.task('scripts', function() {
  return gulp.src(['./vendor/jquery/jquery.min.js', './vendor/bootstrap/js/bootstrap.min.js','./js/*.min.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./js/'));
});

gulp.task('stylesheets', function() {
  return gulp.src([ './vendor/font-awesome/css/font-awesome.min.css', './vendor/bootstrap/css/bootstrap.min.css', './css/*.min.css'])
    .pipe(concatCss('all.css'))
    .pipe(gulp.dest('./css/'));
});

// Minify compiled CSS
gulp.task('minify-css-main', ['less'], function() {
    return gulp.src('css/all.css')
        .pipe(cleanCSS({keepSpecialComments : 0, compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Run everything
gulp.task('default', ['less', 'minify-css', 'minify-js', 'copy', 'scripts', 'stylesheets', 'minify-css-main', 'minify']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    });
});

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function() {
    gulp.watch('less/*.less', ['less']);
    gulp.watch('css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});
