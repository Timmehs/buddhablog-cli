#!/usr/bin/env node

const program = require('commander')
const settings = require('user-settings').file('.buddha-settings')
const { logSuccess, logInfo } = require('../util/output')

program.parse(process.argv)

function printConfig() {
  const userSettings = settings.get()
  logInfo('BuddhaBlog CLI Configuration')
  logInfo('(`buddha config --help` for more options)')
  logInfo('============================')
  for (let key in userSettings) {
    logInfo(`${key.padEnd(13)} | "${userSettings[key]}"`)
    console.log('')
  }
}

function setConfig({ editor }, program) {
  if (editor) {
    settings.set('editor', editor)
    logSuccess(`editor succesfully updated to '${editor}'  ✨`)
    printConfig()
  } else {
    printConfig()
  }
}

module.exports = function(program) {
  program
    .command('config')
    .option(
      '-e, --editor <editor>',
      'executable for your editor of choice.  Will be used to open newly created posts.'
    )
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
