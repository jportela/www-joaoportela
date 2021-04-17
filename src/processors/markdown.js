import marked from 'marked'
import sanitize from 'sanitize-html'
import Prism from 'prismjs'
const loadLanguages = require('prismjs/components/index');

loadLanguages(['bash', 'jsx'])

const SUPPORTED_LANGUAGES = ['javascript', 'bash', 'jsx', 'js']

const renderer = new marked.Renderer()

renderer.code = function (code, infostring) {
  const language = SUPPORTED_LANGUAGES.includes(infostring) ? infostring : null
  return `<pre class="highlight"><code class="language-${language}">${
    language ? Prism.highlight(code, Prism.languages[language], language) : code
  }</code></pre>`
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
  sanitizer: sanitize,
})

export default function markdownProcessor(rawContent, assetLocation) {
  return marked(rawContent, {
    baseUrl: assetLocation,
  })
}
