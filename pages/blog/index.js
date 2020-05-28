import FileLoader from '../../src/loaders/file'
import Blog from '../../src/blog'
import grayMatterProcessor from '../../src/processors/gray-matter'
import BlogLink from '../../components/blog/link'

import styles from './blog.module.css'
import markdownProcessor from '../../src/processors/markdown'

export default function BlogPage({ posts }) {
  const pages = posts.map((post) => {
    return (
      <li key={`post-${post.slug}`}>
        <BlogLink
          title={post.metadata.title}
          slug={post.slug}
          date={post.metadata.date}
          description={post.metadata.description}
        />
      </li>
    )
  })
  return (
    <div>
      <h2>Blog</h2>
      <ul className={styles.posts}>{pages}</ul>
    </div>
  )
}

export async function getStaticProps() {
  const fileLoader = new FileLoader()
  const blog = new Blog({
    loader: fileLoader,
    metadataProcessor: grayMatterProcessor,
    contentProcessor: markdownProcessor,
  })

  await blog.loadManifest('manifest.json')
  const posts = await Promise.all(
    blog.posts.map(async (post) => {
      await post.load()
      return {
        slug: post.slug,
        metadata: post.metadata,
      }
    }),
  )

  return {
    props: {
      posts,
    },
  }
}
