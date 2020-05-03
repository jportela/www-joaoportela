import TwitterIcon from '../../icons/twitter.svg'
import styles from './share.module.css'

export default function BlogShare ({ title, url }) {
  const text = `Check out this blog post by @joaoppcportela "${title}"\n${url}`
  const href = encodeURI(`https://twitter.com/intent/tweet?text=${text}`)
  return (
    <a className={styles.share} href={href}>
      <TwitterIcon />
      Share
    </a>
  )
}
