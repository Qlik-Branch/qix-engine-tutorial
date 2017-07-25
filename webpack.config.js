var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: './src/js/index.js',
    p1: './src/js/101/101. What is QIX and Why Should You Care.js',
    p2: './src/js/102/102. Meet the Engine.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: './images/[name].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: './fonts/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/html/index.ejs',
      filename: 'index.html',
      title: 'Qlik Sense Tutorial',
      chunks: ['app']
    }),
    new HtmlWebpackPlugin({
      template: "src/html/101. What is QIX and Why Should You Care/101. What is QIX and Why Should You Care.ejs",
      filename: "101. What is QIX and Why Should You Care.html",
      title: "What is QIX and Why Should You Care",
      chunks: ['app', 'p1']
    }),
    new HtmlWebpackPlugin({
      template: "src/html/102. Meet the Engine/102. Meet the Engine.ejs",
      filename: "102. Meet the Engine.html",
      title: "Meet the Engine",
      chunks: ['app', 'p2']
    }),
    new ExtractTextPlugin({
      filename: '[name].css'
    })
  ],
  devtool: 'cheap-module-eval-source-map',
}