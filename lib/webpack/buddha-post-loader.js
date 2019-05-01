var yaml = require('js-yaml')

function blogPostSlug({ title, date }) {
  const d = new Date(date)
  const dasherizedTitle = title.toLowerCase().replace(/ /g, '-')
  return `${dasherizedTitle}-${d.getFullYear()}-${d.getMonth()}-${d.getDay()}`
}

function parsePost(rawString) {
  const splitContent = rawString.split('----Content Below This Line----')
  const data = yaml.safeLoad(splitContent[0])
  const tags = (data.tags && data.tags.split(',')) || null

  return {
    ...data,
    tags,
    slug: blogPostSlug(data),
    markdown: splitContent.slice(1).join('')
  }
}

module.exports = function(source) {
  return 'module.exports = ' + JSON.stringify(parsePost(source))
}
