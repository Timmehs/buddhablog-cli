#!/usr/bin/env node

var program = require('commander')
var VERSION = require('../package').version
var REPO_URL = 'https://github.com/Timmehs/buddhablog.git'
var colors = require('colors')

program
  .name('buddhablog')
  .version(VERSION, ' --version')
  .usage('new [name]')

program
  .command('new [name]')
  .description('Create a new BuddhaBlog project called [name].')
  .action(function (env, options) {
    if (env === undefined) {
      program.outputHelp()
    }

    console.log(colors.yellow('Cloning BuddhaBlog from master'))
  })

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

program.parse(process.argv)
