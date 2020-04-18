import ReactMarkdown from 'react-markdown'

import FileLoader from '../../src/loaders/file'
import Blog from '../../src/blog'
import grayMatterProcessor from '../../src/processors/gray-matter'
import BlogDate from '../../components/blog/date'

import * as styles from './post.module.css'

export default function BlogPost({ content, metadata }) {
  const renderedNotes = metadata.notes ? (
    <div className={styles.notes}>
      <ReactMarkdown source={metadata.notes} />
    </div>
  ) : null
  return (
    <article>

      <h2 className={styles.title}>{metadata.title}</h2>
      <p className={styles.date}>
        <BlogDate date={metadata.date} className={styles.date} />
      </p>
      {renderedNotes}

      <ReactMarkdown source={content} />

    </article>
  )
}

export async function getStaticPaths() {
  const fileLoader = new FileLoader()
  const blog = new Blog(fileLoader)

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
  const blog = new Blog(fileLoader, grayMatterProcessor)
  await blog.loadManifest('manifest.json')

  const post = blog.findPostBySlug(slug)

  await post.load()

  return {
    props: {
      metadata: post.metadata,
      content: post.content,
    }
  }

}