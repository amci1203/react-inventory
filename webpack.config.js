module.exports = {
    entry: './app/js/app.jsx',
    output: {
        path: './public',
        filename: 'app.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
}
