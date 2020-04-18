import matter from 'gray-matter'

function getExcerpt(file) {
  file.excerpt = file.content.split('\n').find(excerpt => excerpt)

}

export default function grayMatterProcessor(rawContent) {
  const value = matter(rawContent, {
    excerpt: getExcerpt,
  })
  return {
    data: value.data,
    content: value.content,
    excerpt: value.excerpt,
  }
}
