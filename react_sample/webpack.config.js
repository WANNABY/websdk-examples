const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /@wannaby\/wanna-sdk\/.*iframe.html$/,
        loader: 'file-loader',
      },
      {
        test: /@wannaby\/wanna-sdk\/.*core.js$/,
        loader: 'file-loader',
        options: {
          name: 'core.js',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
};