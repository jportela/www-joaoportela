import BlogDate from './date'
import BlogMarkdown from './markdown'

import * as styles from './header.module.css'

export default function BlogHeader ({ title, date, notes, tags }) {
  const renderedNotes = notes ? (
    <div className={styles.notes}>
      <BlogMarkdown content={notes} />
    </div>
  ) : null

  const renderedTags = tags.map(tag => (
    <li key={tag} className={styles.tag}>{tag}</li>
  ))

  return (
    <>
      <h2 className={styles.title}>{title}</h2>
      <ul className={styles.tags}>
        {renderedTags}
      </ul>
      {renderedNotes}
      <p className={styles.date}>
        Written on <BlogDate date={date} className={styles.date} />
      </p>
    </>
  )
}
