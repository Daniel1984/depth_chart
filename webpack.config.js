const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { NODE_ENV } = process.env;
const IS_BUILD = process.env.npm_lifecycle_event === 'build';

const config = {
  devtool: IS_BUILD ? 'source-map' : 'cheap-module-source-map',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      env: NODE_ENV,
      isProduction: NODE_ENV === 'production',
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
  },
};

module.exports = config;
