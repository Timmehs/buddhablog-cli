const path = require('path')
const { logSuccess } = require('../util/output')

const OPTIONS = ['editor', 'author', 'homepage']
const settings = require('user-settings').file(
  path.resolve(process.cwd(), '.buddhaconfig.js')
)

function printConfig() {
  const userSettings = settings.get()
  console.log('')
  console.log('BuddhaBlog CLI Configuration')
  console.log('-'.repeat(50))
  for (let key in userSettings) {
    console.log(`${key.padEnd(25)} | "${userSettings[key]}"`)
  }
  console.log('-'.repeat(50))
  console.log('(`buddha config --help` for more options)')
}

function setOption(option, value) {
  settings.set(option, value)
  logSuccess(`${option} succesfully updated to '${value}'  ✨`)
}

function setConfig(command, program) {
  OPTIONS.forEach(option => {
    if (command[option]) setOption(option, command[option])
  })
  printConfig()
}

module.exports = function(program) {
  program
    .command('config')
    .option(
      '-e, --editor <editor>',
      'executable for your editor of choice.  Will be used to open newly created posts.'
    )
    .option(
      '-a, --author <author name>',
      'set the main author of the blog. Used in generating posts and rendering meta tags.'
    )
    .option('-h, --homepage <homepage>', 'set the homepage of the blog.')
    .description('Set preferences for buddhablog-cli')
    .action(env => setConfig(env, program))
    .on('--help', function() {
      console.log('')
      console.log('Examples: ')
      console.log(' ')
      console.log('  $ buddha config --editor vim')
      console.log('  $ buddha config --editor code')
    })
}
