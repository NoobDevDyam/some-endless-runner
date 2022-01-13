module.exports = {
  // production mode
  mode: 'production',
  // input file
  entry: './main.js',
  output: {
    // file name
    filename: 'bundle.js',
    // complete path
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
  }
}
