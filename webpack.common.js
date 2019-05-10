const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const htmlTemplateFilename = 'html-template.ejs'
const { BLOG_ROOT, BUDDHABLOG_CLI_ROOT } = process.env

module.exports = {
  context: BLOG_ROOT,
  entry: {
    main: path.resolve(__dirname, 'src', 'index.js')
  },
  output: {
    filename: 'assets/[name].js',
    chunkFilename: 'assets/[name].bundle.js',
    path: path.resolve(BLOG_ROOT, 'build'),
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  resolve: {
    alias: {
      util: path.resolve(__dirname, 'src', 'util'),
      client: path.resolve(BLOG_ROOT)
    }
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*',
        'index.html',
        '!CNAME',
        '!favicon.ico',
        '!README.md'
      ]
    }),
    new webpack.ContextReplacementPlugin(
      /highlight\.js\/lib\/languages$/,
      new RegExp(`^./(ruby|javascript|css|scss|bash)`)
    ),
    new HtmlWebpackPlugin({
      title: require('./package.json').name,
      template: path.resolve(BLOG_ROOT, 'src', htmlTemplateFilename),
      inject: false
    })
  ],
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(BUDDHABLOG_CLI_ROOT, 'lib', 'webpack')
    ]
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        include: [path.resolve(BLOG_ROOT, 'posts')],
        use: ['buddha-post-loader']
      },
      {
        test: /\.md$/,
        include: [path.resolve(BLOG_ROOT, 'pages')],
        use: ['buddha-page-loader']
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              'babel-plugin-import-glob',
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
