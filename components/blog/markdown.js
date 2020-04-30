import useMarkdown from '../../src/hooks/markdown'

export default function BlogMarkdown ({ content }) {
  const formattedContent = useMarkdown(content)

  return (
    <div dangerouslySetInnerHTML={{
      __html: formattedContent
    }}
    />
  )
}
