const path = require('path')
const spawn = require('child_process').spawn
const REPO_URL = 'https://github.com/Timmehs/buddhablog.git'
const { logSuccess, logError, logInfo } = require('../util/output')

function createBlog(dirName, program) {
  var fullPath = path.resolve(process.cwd(), dirName)

  logSuccess(`cloning a new blog project into '${dirName}'\n`)
  const cloneProcess = spawn('git', ['clone', REPO_URL, fullPath], {
    stdio: 'inherit'
  })

  cloneProcess.on('close', code => {
    if (code !== 0) {
      console.log()
      logError('something went wrong :(.')
      process.exit()
    } else {
      console.log()
      logSuccess('project cloned successfully ✨')
      console.log('\nInstall dependencies and get blogging:')
      console.log(`\n  cd ${dirName} && npm install && npm start`)
    }
  })
}

module.exports = function(program) {
  program
    .command('new <name>')
    .description('Create a new BuddhaBlog project in given directory name')
    .action(createBlog)
    .on('--help', function() {
      console.log('')
      logInfo('Example: ')
      logInfo('  $ buddha new my-blog')
    })
}
