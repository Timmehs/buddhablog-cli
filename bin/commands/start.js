const { logInfo, logError } = require('../util/output')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const DEV_CONFIG = path.resolve(__dirname, '../../webpack.dev.config.js')

function startDevServer(command) {
  const sourcePath = command.context
    ? path.resolve(command.context)
    : process.cwd()

  if (!fs.existsSync(path.resolve(sourcePath, 'src'))) {
    logError(
      `Expected to find src/ directory in ${sourcePath}. Please run from within a buddhablog project`
    )
    process.exit()
  }

  logInfo('Compiling project at ' + sourcePath)

  const wdsCommand = [
    'webpack-dev-server',
    '--history-api-fallback',
    '--open',
    `--config ${DEV_CONFIG}`,
    `--env.BUDDHA_ROOT=${sourcePath}`
  ]

  const child = spawn('yarn', wdsCommand, {
    cwd: path.resolve(__dirname, '../..'),
    stdio: 'inherit',
    shell: true,
    env: Object.assign(process.env, { BUDDHA_ROOT: sourcePath })
  })

  child.on('error', e => {
    logError(e)
    child.kill()
    process.exit()
  })
}

module.exports = function(program) {
  program
    .command('start')
    .option(
      '-c, --context <rootDir>',
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
