#!/usr/bin/env node

var program = require('commander')
var path = require('path')
var VERSION = require('../package').version
var REPO_URL = 'https://github.com/Timmehs/buddhablog.git'
var colors = require('colors')
var clone = require('git-clone')
var mkdirp = require('mkdirp')
var exec = require('child_process').exec

program
  .name('buddhablog')
  .version(VERSION, ' --version')
  .usage('new [name]')

program
  .command('new [name]')
  .description('Create a new BuddhaBlog project called [name].')
  .action(function (dirName, options) {
    if (dirName === undefined) {
      program.outputHelp()
    }

    mkdirp(dirName, function (err, made) {
      if (err) {
        console.log(err)
      } else {
        var fullPath = path.join(process.cwd(), dirName)
        clone(REPO_URL, fullPath, function (err) {
          if (err) {
            console.log(
              colors.red(
                `Failed to create buddhablog.  Make sure that ${fullPath} is an empty directory.`
              )
            )
            console.log(err)
            process.exit()
          } else {
            exec('rm -rf .git', { cwd: fullPath }, function (err) {
              if (err) console.log(err)
            })
            console.log(colors.green('Success!'))
            console.log(colors.green(`Next try: `))
            console.log(`cd ${dirName} && npm install && npm start`)
          }
        })
      }
    })

    console.log(colors.yellow('Cloning BuddhaBlog from master'))
  })

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

program.parse(process.argv)
