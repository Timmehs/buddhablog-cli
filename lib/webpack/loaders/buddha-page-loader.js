var yaml = require('js-yaml')

function parsePage(rawString) {
  const splitContent = rawString.split('----Content Below This Line----')
  const data = yaml.safeLoad(splitContent[0])

  return {
    ...data,
    slug: pageSlug(data.title),
    markdown: splitContent.slice(1).join('')
  }
}

function pageSlug(title) {
  return title
    .replace(/[^a-zA-Z ]/g, '')
    .toLowerCase()
    .replace(/ /g, '-')
}
module.exports = function(source) {
  return 'module.exports = ' + JSON.stringify(parsePage(source))
}
