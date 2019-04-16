#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const { green, red } = require('colors')
const spawn = require('child_process').spawn

const REPO_URL = 'https://github.com/Timmehs/buddhablog.git'

program.usage('new <name>').parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
  process.exit()
}

const dirName = program.args[0]

var fullPath = path.resolve(process.cwd(), dirName)

console.log(
  green('BuddhaBlog: ') + `cloning a new blog project into '${dirName}'\n`
)
const cloneProcess = spawn('git', ['clone', REPO_URL, fullPath], {
  stdio: 'inherit'
})

cloneProcess.on('close', code => {
  if (code !== 0) {
    console.log()
    console.log(red('BuddhaBlog: ') + 'something went wrong :(.')
    process.exit()
  } else {
    console.log()
    console.log(green('BuddhaBlog: ') + 'project cloned successfully ✨')
    console.log(
      green('BuddhaBlog: ') + 'Install dependencies and get blogging:'
    )
    console.log(`\n  cd ${dirName} && npm install && npm start`)
  }
})
