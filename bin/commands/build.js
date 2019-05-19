const path = require('path')
const fs = require('fs')
const { logError, logInfo } = require('../util/output')
const { spawn } = require('child_process')
const PROD_CONFIG = path.resolve(__dirname, '../../webpack.prod.js')

function buildBlog(command) {
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

  const buildCommand = [
    'webpack -p',
    `--config ${PROD_CONFIG}`,
    `--env.BUDDHA_ROOT=${sourcePath}`
  ]

  const child = spawn('yarn', buildCommand, {
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
    .command('build')
    .description('Build your blog site for deployment')
    .action(buildBlog)
    .on('--help', function() {
      console.log('\nExample: ')
      console.log('  $ buddha build')
    })
}
