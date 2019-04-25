const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const projectRoot = process.cwd()
console.log(projectRoot)

const { logSuccess, logInfo } = require('./bin/util/output')

let htmlTemplateFilename = 'html-template.ejs'
let templatePath = path.join(projectRoot, 'src', htmlTemplateFilename)

if (fs.existsSync(templatePath)) {
  logSuccess(`Template found! Using ${templatePath}.`)
} else {
  logInfo(
    `No template found at ${templatePath}, using default. To customize place ${htmlTemplateFilename} in src/.`
  )
  templatePath = path.join(__dirname, htmlTemplateFilename)
}

module.exports = {
  context: projectRoot,
  entry: {
    main: path.resolve(projectRoot, 'src', 'index.js'),
    blog: path.resolve(projectRoot, 'src', 'store.js')
  },
  output: {
    filename: 'assets/[name].js',
    path: path.resolve(projectRoot, 'build'),
    publicPath: '/'
  },
  devServer: {
    contentBase: path.resolve(projectRoot, 'build'),
    hot: true
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
      template: templatePath,
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
        include: [path.resolve(projectRoot, 'posts')],
        use: ['buddha-post-loader']
      },
      {
        test: /\.md$/,
        include: [path.resolve(projectRoot, 'pages')],
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
