#!/usr/bin/env node

var fs = require('fs')
var program = require('commander')
var path = require('path')
var VERSION = require('../package').version
var TEMPLATE_DIR = path.join(__dirname, '..', 'template')
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

    console.log('Cloning BuddhaBlog from master')
  })

program.parse(process.argv)
