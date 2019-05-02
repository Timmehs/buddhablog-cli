var yaml = require('js-yaml')

function blogPostSlug({ title, date }) {
  const dasherizedTitle = title.toLowerCase().replace(/ /g, '-')
  return `${dasherizedTitle}-${slugDate(date)}`
}

const slugDate = date => {
  var d = new Date(date)
  const year = d.getFullYear()
  const month = ('0' + (d.getMonth() + 1)).slice(-2)
  const day = ('0' + d.getDate()).slice(-2)

  return `${year}-${month}-${day}`
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
