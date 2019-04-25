#!/usr/bin/env node

function startDevServer(path) {
  console.log(path)

  if (path) {
    console.log('we got a path')
    console.log(path)
  } else {
    console.log('assuming project root')
  }
  const sourcePath = path || process.cwd()

  const webpack = require('webpack')
  const WebpackDevServer = require('webpack-dev-server')
  const config = require('../../webpack.dev.config')(sourcePath)

  console.log(process.argv)
  const port = 8080

  const options = {
    publicPath: config.output.publicPath,
    hot: true,
    inline: true,
    stats: {
      colors: true
    },
    open: true
  }

  const server = new WebpackDevServer(webpack(config), options)

  server.listen(port, 'localhost', function(err) {
    if (err) {
      console.log(err)
    }
    console.log('WebpackDevServer listening at localhost:', port)
  })
}

module.exports = function(program) {
  program
    .command('start')
    .option(
      '-c, --context',
      'Context in which to run dev-server. Must be the root path of your project.'
    )
    .description(
      'Start buddhablog development environment, for blogging and customiziation work of your website.'
    )
    .action(startDevServer)
    .on('--help', function() {
      console.log(
        "\nBuddhablog development server uses a default webpack configuration with loaders for react, css, scss, and Buddhablog markdown files (pages and posts).'"
      )
      console.log('\nExamples: ')
      console.log('\nFrom project root: ')
      console.log('\n   $ buddha start')
      console.log('\nFrom outside project root: ')
      console.log('\n    $ buddha start -c ../my-blog/')
    })
}
