export default function BlogMarkdown({ content }) {
  return (
    <div dangerouslySetInnerHTML={{
      __html: content,
    }} />
  )
}