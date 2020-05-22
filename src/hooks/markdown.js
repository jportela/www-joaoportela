import { useMemo } from 'react'
import markdownProcessor from '../processors/markdown'

export default function useMarkdown (content, assetLocation) {
  return useMemo(() => content ? markdownProcessor(content, assetLocation) : null, content)
}
