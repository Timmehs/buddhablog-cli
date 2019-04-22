const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    main: path.resolve(process.env.NODE_ENV, 'src', 'index.js'),
    blog: path.resolve(process.env.NODE_ENV, 'src', 'store.js')
  },
  output: {
    filename: 'assets/[name].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    hot: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ContextReplacementPlugin(
      /highlight\.js\/lib\/languages$/,
      new RegExp(`^./(ruby|javascript|css|scss|bash)`)
    ),
    new HtmlWebpackPlugin({
      title: require('./package.json').name,
      template: path.resolve(process.env.NODE_PATH, 'src', 'index.ejs'),
      inject: false
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolveLoader: {
    modules: ['node_modules', 'node_modules/buddhablog-cli/lib/webpack']
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        include: [path.resolve(__dirname, 'posts')],
        use: ['buddha-post-loader']
      },
      {
        test: /\.md$/,
        include: [path.resolve(__dirname, 'pages')],
        use: ['buddha-page-loader']
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              'import-glob',
              '@babel/plugin-proposal-object-rest-spread',
              'react-hot-loader/babel'
            ]
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: 'style-loader' }, // creates style nodes from JS strings
          { loader: 'css-loader' }, // translates CSS into CommonJS
          { loader: 'sass-loader' } // compiles Sass to CSS
        ]
      }
    ]
  }
}
