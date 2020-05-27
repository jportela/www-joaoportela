import matter from 'gray-matter'
import format from 'date-fns/format'

function getExcerpt(file) {
  file.excerpt = file.content.split('\n').find((excerpt) => excerpt)
}

export default function grayMatterProcessor(rawContent) {
  const value = matter(rawContent, {
    excerpt: getExcerpt,
  })

  const metadata = value.data

  if (metadata.date) {
    metadata.date = format(new Date(metadata.date), 'MMMM dd, yyyy')
  }

  return {
    metadata,
    content: value.content,
    excerpt: value.excerpt,
  }
}
