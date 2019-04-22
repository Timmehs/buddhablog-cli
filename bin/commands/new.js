const path = require('path')
const { spawnSync } = require('child_process')
const REPO_URL = 'https://github.com/Timmehs/buddhablog-template.git'
const { logSuccess, logError } = require('../util/output')

function createBlog(dirName, program) {
  var fullPath = path.resolve(process.cwd(), dirName)

  logSuccess(`Building project from '${REPO_URL}' ...`)
  try {
    spawnSync('git', ['clone', REPO_URL, fullPath], {
      shell: true,
      stdio: 'inherit'
    })
    logSuccess('Project cloned successfully ✨')
    console.log('\nInstall dependencies and get blogging:')
    console.log(`\n  cd ${dirName} && npm install && npm start`)
  } catch (error) {
    console.log()
    logError('something went wrong :(.')
    console.error(error)
  }

  process.exit()
}

module.exports = function(program) {
  program
    .command('new <name>')
    .description('Create a new BuddhaBlog project in given directory name')
    .action(createBlog)
    .on('--help', function() {
      console.log('\nExample: ')
      console.log('  $ buddha new my-blog')
    })
}
