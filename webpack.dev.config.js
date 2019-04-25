const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { logSuccess, logInfo } = require('./bin/util/output')

const htmlTemplateFilename = 'html-template.ejs'

function templateFilePath(srcPath) {
  let templatePath = path.join(srcPath, 'src', htmlTemplateFilename)

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

module.exports = function(srcPath) {
  return {
    context: path.resolve(__dirname),
    mode: 'development',
    entry: {
      main: path.resolve(srcPath, 'src', 'index.js'),
      blog: path.resolve(srcPath, 'src', 'store.js')
    },
    output: {
      filename: 'assets/[name].js',
      path: path.resolve(srcPath, 'build'),
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
        template: templateFilePath(srcPath),
        inject: false
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    resolveLoader: {
      modules: ['node_modules', './lib/webpack']
    },
    module: {
      rules: [
        {
          test: /\.md$/,
          include: [path.resolve(srcPath, 'posts')],
          use: ['buddha-post-loader']
        },
        {
          test: /\.md$/,
          include: [path.resolve(srcPath, 'pages')],
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
}
