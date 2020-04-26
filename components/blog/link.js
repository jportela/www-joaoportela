import Link from 'next/link'

import BlogDate from './date'
import BlogMarkdown from './markdown'

import * as styles from './link.module.css'

export default function BlogLink({ title, slug, date, excerpt }) {
  const pageLocation = `/blog/${slug}`
  return (
    <>
      <h3>
        <Link href="/blog/[slug]" as={pageLocation}>
          <a>{title}</a>
        </Link>
      </h3>
      <p className={styles.date}>
        <BlogDate date={date} className={styles.date}/>
      </p>
      <BlogMarkdown content={excerpt} />
      <p className={styles.readMore}>
        <Link href="/blog/[slug]" as={pageLocation}>
          <a>read more →</a>
        </Link>
      </p>
    </>
  )
}
