import * as styles from './footer.module.css'

export default function Footer() {
  return (
    <p className={styles.container}>
      Made with ❤️ and <a href="https://nextjs.org/">Next.js</a>.
      Hosted on <a href="https://zeit.co/">ZEIT</a>.
      Source at <a href="https://github.com/jportela/www-joaoportela/">GitHub</a>.
    </p>
  )
}