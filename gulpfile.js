/**
 * Created by Brett on 6/15/2016.
 */
var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');
var concat = require('gulp-concat');

var jsFiles = './public/js/app/*.js',
    jsDest = 'public/js/';

gulp.task('build', ['clean', 'scripts'], function () {
    return gulp.src([
            './**/*.js', './**/www',
            '!./node_modules/**', '!./gulpfile.js', '!./out/**', '!./public/bower_components/**'
        ])
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return del(['dist/**/*']);
});

gulp.task('scripts', ['clean'], function() {
    return gulp.src(['./public/js/app/constants/*.js', './public/js/app/controllers/*.js', './public/js/app/directives/*.js','./public/js/app/routes/*.js', jsFiles])

        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest));
});