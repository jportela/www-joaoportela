import useMarkdown from '../../src/hooks/markdown'

export default function BlogMarkdown ({ content, assetLocation }) {
  const formattedContent = useMarkdown(content, assetLocation)

  return (
    <div dangerouslySetInnerHTML={{
      __html: formattedContent
    }}
    />
  )
}
