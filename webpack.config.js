var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    p1: './src/js/101/101. What is QIX and Why Should You Care.js',
    p2: './src/js/102/102. Meet the Engine.js',
    p3: './src/js/103/103. Talk to the Engine.js',
    p4: './src/js/104/104. Stay in Sync with the Engine.js',
    p5: './src/js/105/105. Streamline with Enigma.js',
    p6: './src/js/106/106. Build a Dashboard - Set Up.js',
    p7: './src/js/107/107. Creating Filters with ListObjects.js',
    p8: './src/js/108/108. Creating Charts with HyperCubes.js',
    app: './src/js/index.js'
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
    new HtmlWebpackPlugin({
      template: "src/html/103. Talk to the Engine/103. Talk to the Engine.ejs",
      filename: "103. Talk to the Engine.html",
      title: "Talk to the Engine",
      chunks: ['app', 'p3']
    }),
    new HtmlWebpackPlugin({
      template: "src/html/104. Stay in Sync with the Engine/104. Stay in Sync with the Engine.ejs",
      filename: "104. Stay in Sync with the Engine.html",
      title: "Stay in Sync with the Engine",
      chunks: ['app', 'p4']
    }),
    new HtmlWebpackPlugin({
      template: "src/html/105. Streamline with Enigma/105. Streamline with Enigma.ejs",
      filename: "105. Streamline with Enigma.html",
      title: "Streamline with Enigma",
      chunks: ['app', 'p5']
    }),
    new HtmlWebpackPlugin({
      template: "src/html/106. Build a Dashboard - Set Up/106. Build a Dashboard - Set Up.ejs",
      filename: "106. Build a Dashboard - Set Up.html",
      title: "Build a Dashboard - Set Up",
      chunks: ['app', 'p6']
    }),
    new HtmlWebpackPlugin({
      template: "src/html/107. Creating Filters with ListObjects/107. Creating Filters with ListObjects.ejs",
      filename: "107. Creating Filters with ListObjects.html",
      title: "Creating Filters with ListObjects",
      chunks: ['app', 'p7']
    }),
    new HtmlWebpackPlugin({
      template: "src/html/108. Creating Charts with HyperCubes/108. Creating Charts with HyperCubes.ejs",
      filename: "108. Creating Charts with HyperCubes.html",
      title: "Creating Charts with HyperCubes",
      chunks: ['app', 'p8']
    }),
    new HtmlWebpackPlugin({
      template: 'src/html/index.ejs',
      filename: 'index.html',
      title: 'Qlik Sense Tutorial',
      chunks: ['app']
    }),
    new ExtractTextPlugin({
      filename: '[name].css'
    })
  ],
  devtool: 'cheap-module-eval-source-map',
}