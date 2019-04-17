const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const { logError, logSuccess, logInfo } = require('../util/output')
const settings = require('user-settings').file('.buddha-settings')
const POSTDIR = path.join(process.cwd(), 'posts')

const buildPost = (title, tags, timestamp) =>
  `title: ${title}
tags: ${tags.join(',')}
date: ${timestamp}
header: "https://d1u0z01nzsqzn7.cloudfront.net/images/buddhaz.jpg" # Replace this with a new image
----Content Below This Line----

write content here
`

function createPost(title = '', tags = []) {
  const editor = settings.get('editor') || 'vim'
  console.log('create post')

  if (!fs.existsSync(POSTDIR)) {
    logError(
      "No posts directory found -- are sure you're inside of a BuddhaBlog project?"
    )
    process.exit()
  } else {
    logInfo('Generating timestamp...')
    const timeStamp = spawnSync('date', ['+%Y-%m-%dT%H:%M:%S'])
      .output[1].toString()
      .trim()
    const newPostPath = path.join(POSTDIR, `${timeStamp}.md`)

    logInfo('Building post...')
    try {
      fs.writeFileSync(newPostPath, buildPost(title, tags, timeStamp))
      logSuccess(`post creation successful! ✨ ${newPostPath}`)
      logInfo(
        `Opening file with "${editor} ${newPostPath}" (see \`buddha config --help\` to change editor)`
      )
      spawnSync(editor, [newPostPath], {
        stdio: 'inherit'
      })
      process.exit()
    } catch (error) {
      logError('post creation failed :(')
      console.error(error)
      process.exit()
    }
  }
}

module.exports = function(program) {
  console.log('twice')
  program
    .command('post [title] [tags...]')
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
