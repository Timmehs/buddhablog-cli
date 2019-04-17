const path = require('path')
const { spawnSync } = require('child_process')
const { logInfo } = require('../util/output')
const generateFile = require('../util/generateFile')
const settings = require('user-settings').file('.buddha-settings')
const POSTDIR = path.join(process.cwd(), 'posts')
const editor = settings.get('editor') || 'vim'

const buildPost = (title, tags, timestamp) =>
  `title: ${title}
tags: ${tags.join(',')}
date: ${timestamp}
header: "https://d1u0z01nzsqzn7.cloudfront.net/images/buddhaz.jpg" # Replace this with a new image
----Content Below This Line----

write content here
`

function createPost(title = '', tags = []) {
  logInfo('Generating timestamp...')
  const timeStamp = spawnSync('date', ['+%Y-%m-%dT%H:%M:%S'])
    .output[1].toString()
    .trim()
  const newPostPath = path.join(POSTDIR, `${timeStamp}.md`)

  generateFile(newPostPath, buildPost(title, tags, timeStamp), function(err) {
    if (err) process.exit()
    logInfo(
      `Opening file with "${editor} ${newPostPath}" (see \`buddha config --help\` to change editor)`
    )
    spawnSync(editor, [newPostPath], {
      stdio: 'inherit'
    })
    process.exit()
  })
}

module.exports = function(program) {
  program
    .command('post [title] [tags...]')
    .usage('[title] [tags...]')
    .description('Create a new blog post. Timestamp defaults to now')
    .action(createPost)
    .on('--help', function() {
      console.log('\nℹ️  Be sure to put quotes around multi-word titles.')
      console.log('\nExample: ')
      console.log(
        '  $ buddha post "Frontend Adventures" reactjs webpack headaches'
      )
    })
}
