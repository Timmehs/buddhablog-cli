const { logError, logSuccess } = require('./output')
const path = require('path')
const fs = require('fs')

module.exports = function(filePath, contents, cb) {
  const fileDir = path.dirname(filePath)
  if (!fs.existsSync(fileDir)) {
    logError(
      `${fileDir}' not found -- are sure you're inside of a BuddhaBlog project?`
    )
    process.exit()
  } else {
    try {
      fs.writeFileSync(filePath, contents)
      logSuccess(`File generation successful ${filePath} ✨`)
      cb()
    } catch (error) {
      logError('File generation failed :(')
      console.error(error)
      cb(error)
    }
  }
}
