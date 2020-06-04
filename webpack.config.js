const webpack = require('webpack');
const path    = require('path');

module.exports = {
  context   : __dirname + '/src',
  entry: './index.js',
  mode: 'none',
  module    : {
    rules : [{
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
      exclude : /node_modules/,
    }],
  },
  externals : {
    react        : 'react',
    'react-dom' : 'react-dom',
    'react/addons' : 'react'
  },
  output    : {
    libraryTarget : 'var',
    library       : 'Winterfell',
    filename      : 'winterfell.min.js',
    path          : __dirname + '/dist'
  },
  plugins  : [
    
  ]
};