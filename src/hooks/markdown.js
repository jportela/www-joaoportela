import { useMemo } from 'react'
import markdownProcessor from '../processors/markdown'

export default function useMarkdown (content) {
  return useMemo(() => content ? markdownProcessor(content) : null, content)
}
