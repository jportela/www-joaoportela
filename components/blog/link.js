import Link from 'next/link'

import BlogDate from './date'

import styles from './link.module.css'

export default function BlogLink({ title, slug, date, description }) {
  const pageLocation = `/blog/${slug}`
  return (
    <>
      <div className={styles.header}>
        <h3>
          <Link href="/blog/[slug]" as={pageLocation}>
            <a>{title}</a>
          </Link>
        </h3>
        <span className={styles.date}>
          <BlogDate date={date} />
        </span>
      </div>
      <p>{description}</p>
      <p className={styles.readMore}>
        <Link href="/blog/[slug]" as={pageLocation}>
          <a>read more →</a>
        </Link>
      </p>
    </>
  )
}
