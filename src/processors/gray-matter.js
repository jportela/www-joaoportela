import matter from 'gray-matter'
import format from 'date-fns/format'

export default function grayMatterProcessor(rawContent) {
  const value = matter(rawContent)

  const metadata = value.data

  if (metadata.date) {
    metadata.date = format(new Date(metadata.date), 'MMMM dd, yyyy')
  }

  return {
    metadata,
    content: value.content,
  }
}
