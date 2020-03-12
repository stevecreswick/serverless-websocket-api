const slsw = require('serverless-webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  externals: [nodeExternals()],
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  optimization: {
    // Set to false for development
    minimize: slsw.lib.options.stage === 'local' ? false : true
  }
};
