import marked from 'marked'
import sanitize from 'sanitize-html'
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript);

const renderer = new marked.Renderer();
renderer.code = function (code, infostring) {
  return `<pre class="hljs"><code class="language-${infostring}">${hljs.highlight(infostring, code).value}</code></pre>`
}

marked.setOptions({
  renderer,
  sanitizer: sanitize,
});

export default function markdownProcessor(rawContent) {
  return marked(rawContent);
}
