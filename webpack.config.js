module.exports = {
    entry: './app/js/app.js',
    output: {
        path: './public',
        filename: 'app.js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
}
