const gulp = require('gulp'),
    concat = require('gulp-concat')
    terser = require('gulp-terser');

gulp.task('minify', () => {
    const js_input = ['lib/relaxedGMap.js']

    const output_dir = 'dist'
     return (gulp.src(js_input)
        .pipe(concat('relaxed-gmap.min.js'))
        .pipe(terser({
            compress: true,
            mangle: true,
        }))
        .pipe(gulp.dest(output_dir)))
})
