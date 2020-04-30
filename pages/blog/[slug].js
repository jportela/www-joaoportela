import Blog from '../../src/blog'
import FileLoader from '../../src/loaders/file'
import grayMatterProcessor from '../../src/processors/gray-matter'
import markdownProcessor from '../../src/processors/markdown'
import BlogMarkdown from '../../components/blog/markdown'
import BlogLicense from '../../components/blog/license'
import BlogHeader from '../../components/blog/header'

export default function BlogPost ({ content, metadata, notes }) {
  return (
    <article>

      <BlogHeader
        title={metadata.title}
        date={metadata.date}
        tags={metadata.tags}
        notes={notes}
      />

      <BlogMarkdown content={content} />

      <BlogLicense />

    </article>
  )
}

export async function getStaticPaths () {
  const fileLoader = new FileLoader()
  const blog = new Blog({
    loader: fileLoader,
    ignoreContent: true,
    ignoreMetadata: true
  })

  await blog.loadManifest('manifest.json')

  const paths = blog.posts.map(post => ({
    params: { slug: post.slug }
  }))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps (context) {
  const slug = context.params.slug
  const fileLoader = new FileLoader()
  const blog = new Blog({
    loader: fileLoader,
    metadataProcessor: grayMatterProcessor,
    contentProcessor: markdownProcessor
  })
  await blog.loadManifest('manifest.json')

  const post = blog.findPostBySlug(slug)

  await post.load()

  return {
    props: {
      metadata: post.metadata,
      content: post.content,
      notes: post.notes
    }
  }
}
