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
module.exports = env => {
  const BUDDHA_ROOT = env.BUDDHA_ROOT || process.cwd()
  return {
    context: path.resolve(__dirname),
    mode: 'development',
    entry: {
      main: path.resolve(__dirname, 'src', 'index.js')
    },
    output: {
      filename: 'assets/[name].js',
      chunkFilename: 'assets/[name].bundle.js',
      path: path.join(BUDDHA_ROOT, 'build'),
      publicPath: '/'
    },
    resolve: {
      alias: {
        client: path.resolve(BUDDHA_ROOT, 'src'),
        blog: path.resolve(BUDDHA_ROOT, 'posts'),
        pages: path.resolve(BUDDHA_ROOT, 'pages'),
        'react-dom': '@hot-loader/react-dom',
        'react-hot-loader': path.resolve(
          __dirname,
          'node_modules',
          'react-hot-loader'
        )
      }
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
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.BUDDHA_ROOT': JSON.stringify(BUDDHA_ROOT),
        'process.env.BUDDHA_SRC': JSON.stringify(BUDDHA_ROOT)
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
                'react-hot-loader/babel',
                'import-glob',
                '@babel/plugin-proposal-object-rest-spread'
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
