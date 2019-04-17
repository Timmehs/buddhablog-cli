#!/usr/bin/env node

const program = require('commander')
const settings = require('user-settings').file('.user-settings')

program
  .option(
    '-e, --editor <editor>',
    'executable for your editor of choice.  Will be used to open newly created posts.'
  )
  .parse(process.argv)
