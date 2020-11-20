const gulp = require('gulp'),
    concat = require('gulp-concat')
    terser = require('gulp-terser')
    babel = require('gulp-babel');

gulp.task('minify', () => {
    const js_input = ['lib/relaxedGMap.js']

    const output_dir = 'lib'
     return (gulp.src(js_input)
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(concat('relaxedGmap.min.js'))
        .pipe(terser({
            compress: true,
            mangle: true,
        }))
        .pipe(gulp.dest(output_dir)))
})

gulp.task('es5', () => {
    const js_input = ['lib/relaxedGMap.js']

    const output_dir = 'lib'
    return (gulp.src(js_input)
        .pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(concat('relaxedGmap.es5.js'))
        .pipe(gulp.dest(output_dir)))
})
