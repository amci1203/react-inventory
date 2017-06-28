var gulp    = require('gulp'),
    webpack = require('webpack');

gulp.task('scripts', cb => {
    webpack(require('../webpack.config.js'), (err, stats) => {
        if (err) { console.log(err.toString()) }
        console.log('Script Packing Done...\n\n');
        console.log(stats.toString());
        cb()
    })
})
