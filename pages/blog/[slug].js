import FileLoader from '../../src/loaders/file'
import Blog from '../../src/blog'
import grayMatterProcessor from '../../src/processors/gray-matter'
import BlogDate from '../../components/blog/date'

import * as styles from './slug.module.css'
import BlogMarkdown from '../../components/blog/markdown'
import markdownProcessor from '../../src/processors/markdown'

export default function BlogPost({ content, metadata, notes }) {
  const renderedNotes = notes ? (
    <div className={styles.notes}>
      <BlogMarkdown content={notes} />
    </div>
  ) : null
  return (
    <article>

      <h2 className={styles.title}>{metadata.title}</h2>
      {renderedNotes}
      <p className={styles.date}>
        Written on <BlogDate date={metadata.date} className={styles.date} />
      </p>

      <BlogMarkdown content={content} />

    </article>
  )
}

export async function getStaticPaths() {
  const fileLoader = new FileLoader()
  const blog = new Blog({
    loader: fileLoader,
    ignoreContent: true,
    ignoreMetadata: true,
  })

  await blog.loadManifest('manifest.json')

  const paths = blog.posts.map(post => ({
    params: { slug: post.slug }
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const slug = context.params.slug
  const fileLoader = new FileLoader()
  const blog = new Blog({
    loader: fileLoader,
    metadataProcessor: grayMatterProcessor,
    contentProcessor: markdownProcessor,
  })
  await blog.loadManifest('manifest.json')

  const post = blog.findPostBySlug(slug)

  await post.load()

  return {
    props: {
      metadata: post.metadata,
      content: post.content,
      notes: post.notes,
    }
  }

}