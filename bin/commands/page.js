const path = require('path')
const { spawnSync } = require('child_process')
const { logInfo } = require('../util/output')
const generateFile = require('../util/generateFile')
const settings = require('user-settings').file('.buddha-settings')
const PAGEDIR = path.join(process.cwd(), 'pages')
const editor = settings.get('editor') || 'vim'

const buildPost = title =>
  `title: ${title}
order: 1
----Content Below This Line----

write content here
`

function createPage(title = '') {
  const newPagePath = path.join(
    PAGEDIR,
    `${title.toLowerCase().replace(' ', '-')}.md`
  )

  generateFile(newPagePath, buildPost(title), function(err) {
    if (err) process.exit()
    logInfo(
      `Opening file with "${editor} ${newPagePath}" (see \`buddha config --help\` to change editor)`
    )
    spawnSync(editor, [newPagePath], {
      stdio: 'inherit'
    })
    process.exit()
  })
}

module.exports = function(program) {
  program
    .command('page <title>')
    .usage('<title>')
    .description('Create a new page for your site.')
    .action(createPage)
    .on('--help', function() {
      console.log('\nℹ️  Be sure to put quotes around multi-word titles.')
      console.log('\nExample: ')
      console.log('  $ buddha page "About me"')
    })
}
