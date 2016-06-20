/**
 * Created by Brett on 6/15/2016.
 */
var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');

gulp.task('build', ['clean'], function () {
    return gulp.src([
            './**/*.js', './**/www',
            '!./node_modules/**', '!./gulpfile.js', '!./out/**'
        ])
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return del(['dist/**/*']);
});