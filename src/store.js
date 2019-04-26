import * as posts from 'client/posts/*.md'
import * as pages from 'client/pages/*.md'

export default {
  posts: Object.values(posts).sort(post => -new Date(post.date)),
  pages: Object.values(pages).sort((a, b) => a.order - b.order)
}
