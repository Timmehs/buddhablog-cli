#!/usr/bin/env node

var program = require('commander')
var VERSION = require('../package').version

program.version(VERSION, ' --version')

/* Register Commands */
require('./commands/new.js')(program)
require('./commands/post.js')(program)
require('./commands/config.js')(program)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

program.parse(process.argv)
