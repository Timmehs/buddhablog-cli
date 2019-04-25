const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { logSuccess, logInfo } = require('./bin/util/output')

const htmlTemplateFilename = 'html-template.ejs'

function templateFilePath(BUDDHA_ROOT) {
  let templatePath = path.join(BUDDHA_ROOT, 'src', htmlTemplateFilename)

  if (fs.existsSync(templatePath)) {
    logSuccess(`Template found! Using ${templatePath}.`)
  } else {
    logInfo(
      `No template found at ${templatePath}, using default. To customize place ${htmlTemplateFilename} in src/.`
    )
    templatePath = path.join(__dirname, htmlTemplateFilename)
  }

  return templatePath
}

/**
 * `BUDDHA_ROOT` is the root directory of the Buddhablog project to be compiled
 */
const BUDDHA_ROOT = process.env.BUDDHA_ROOT || process.cwd()

module.exports = {
  context: path.resolve(__dirname),
  mode: 'development',
  entry: {
    main: path.join(BUDDHA_ROOT, 'src', 'index.js'),
    blog: path.join(BUDDHA_ROOT, 'src', 'store.js')
  },
  output: {
    filename: 'assets/[name].js',
    path: path.join(BUDDHA_ROOT, 'build'),
    publicPath: '/'
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ContextReplacementPlugin(
      /highlight\.js\/lib\/languages$/,
      new RegExp(`^./(ruby|javascript|css|scss|bash)`)
    ),
    new HtmlWebpackPlugin({
      title: require('./package.json').name,
      template: templateFilePath(BUDDHA_ROOT),
      inject: false
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    contentBase: path.resolve(BUDDHA_ROOT, 'build')
  },
  resolveLoader: {
    modules: ['node_modules', './lib/webpack']
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        include: [path.resolve(BUDDHA_ROOT, 'posts')],
        use: ['buddha-post-loader']
      },
      {
        test: /\.md$/,
        include: [path.resolve(BUDDHA_ROOT, 'pages')],
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
