const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const { logError, logSuccess, logInfo } = require('../util/output')

const buildPost = (title, tags, timestamp) =>
  `title: ${title}
tags: ${tags.join(',')}
date: ${timestamp}
header: "https://d1u0z01nzsqzn7.cloudfront.net/images/buddhaz.jpg" # Replace this with a new image
----Content Below This Line----

write content here
`

function createPost(title = '', tags = []) {
  logInfo('generating post...')
  const POSTS = path.join(process.cwd(), 'posts')
  if (!fs.existsSync(POSTS)) {
    logError(
      "No posts directory found -- are sure you're inside of a BuddhaBlog project?"
    )
    process.exit()
  } else {
    const timeStamp = spawnSync('date', ['-u', '+%Y-%m-%dT%H:%M:%SZ'])
      .output[1].toString()
      .trim()

    const newPostPath = path.join(POSTS, `${timeStamp}.md`)
    try {
      fs.writeFileSync(newPostPath, buildPost(title, tags, timeStamp))
    } catch (error) {
      logError('post creation failed :(')
      console.error(error)
      process.exit()
    }
    spawnSync('vim', [newPostPath], { stdio: 'inherit' })
    logInfo(fs.readFileSync(newPostPath))
    logSuccess('post creation successful ✨')
  }
}

module.exports = function(program) {
  program
    .command('post [title] [tags...]')
    .description("Create a new blog post with today's date.")
    .action(createPost)
    .on('--help', function() {
      console.log(' ')
      console.log('ℹ️  Be sure to put quotes around multi-word titles.')
      console.log(' ')
      console.log('Example: ')
      console.log(
        '  $ buddha post "Frontend Adventures" reactjs webpack headaches'
      )
    })
}
