import marked from 'marked'
import sanitize from 'sanitize-html'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import bash from 'highlight.js/lib/languages/bash'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('bash', bash)

const renderer = new marked.Renderer()

renderer.code = function (code, infostring) {
  const language = infostring || 'plaintext'
  return `<pre class="hljs"><code class="language-${language}">${hljs.highlight(language, code).value}</code></pre>`
}

const rawImageRenderer = marked.Renderer.prototype.image.bind(renderer)

renderer.image = function image(href, title, text) {
  const img = rawImageRenderer(href, title, text)

  if (title) {
    return `<figure>${img}<figcaption>${sanitize(title)}</figcaption></figure>`
  }

  return img
}

marked.setOptions({
  renderer,
  sanitizer: sanitize
})

export default function markdownProcessor (rawContent, assetLocation) {
  return marked(rawContent, {
    baseUrl: assetLocation,
  })
}

