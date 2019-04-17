const { green, red, yellow, blue } = require('colors')
const PREFIX = 'BuddhaBlog: '

module.exports = {
  logWarn: string => console.log(yellow(PREFIX) + string),
  logInfo: string => console.log(blue(PREFIX) + string),
  logSuccess: string => console.log(green(PREFIX) + string),
  logError: string => console.log(red(PREFIX) + string)
}
