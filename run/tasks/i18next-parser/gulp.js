'use strict';

/**
 *  ???.
 *
 *  Example Usage:
 *  gulp i18next-parser
 */

var gulp = require('gulp'),
    i18next = require('i18next-parser');

gulp.task('i18next-parser', function() {
    gulp.src('./js/src/**')
        .pipe(i18next({
            namespaceSeparator: ':::',
            keySeparator: '::',
            functions: ['t', 'tr'],
            locales: ['en', 'fr'],
            output: './'
        }))
        .pipe(gulp.dest('./locales'));
});