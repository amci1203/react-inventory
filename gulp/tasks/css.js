const gulp         = require('gulp'),
      math         = require('postcss-calc'),
      mixins       = require('postcss-mixins'),
      hexRGB       = require('postcss-hexrgba'),
      cssVars      = require('postcss-simple-vars'),
      postCSS      = require('gulp-postcss'),
      nesting      = require('postcss-nested'),
      colorMath    = require('postcss-color-function'),
      postImport   = require('postcss-import'),
      autoprefixer = require('autoprefixer');

gulp.task('css', function () {
    console.log('---> Filtering CSS file...');
    return gulp.src('./assets/css/styles.css')
        .pipe(postCSS([
            postImport,
            cssVars,
            mixins,
            nesting,
            math,
            colorMath,
            hexRGB,
            autoprefixer
        ]))
        .on('error', function (err) {
            console.log('There seems to be an error with your CSS.');
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(gulp.dest('./public'));
})
