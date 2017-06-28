const
    gulp         = require('gulp'),
    postCSS      = require('gulp-postcss'),

    plugins = ['precss', 'postcss-calc', 'autoprefixer'].map(plugin => require(plugin));

gulp.task('css', function () {
    return gulp.src('./app/css/styles.css')
        .pipe(postCSS(plugins))
        .on('error', function (err) {
            console.log('There seems to be an error with your CSS.');
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(gulp.dest('./public'));
})
