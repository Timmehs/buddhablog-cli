#!/usr/bin/env node

var program = require('commander')
var path = require('path')
var VERSION = require('../package').version

process.env['BUDDHABLOG_CLI_ROOT'] = path.resolve(__dirname, '..')
process.env['BUDDHABLOG_CALLER_ROOT'] = process.cwd()

program.version(VERSION, ' --version')

/* Register Commands */
require('./commands/new.js')(program)
require('./commands/post.js')(program)
require('./commands/page.js')(program)
require('./commands/config.js')(program)
require('./commands/start.js')(program)
require('./commands/build.js')(program)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

program.parse(process.argv)
