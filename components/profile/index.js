import ProfileContact from './contact'

import * as styles from './profile.module.css'

export default function Profile() {
  return (
    <header className={styles.container}>
      <img src="/jportela.jpg" alt="Joao's Photo" className={styles.photo} />
      <h1 className={styles.name}>João Portela</h1>

      <p className={styles.shortBio}>
        👋 I’m a Software Engineer, passionate about building well crafted, user centered experiences.
      </p>

      <ProfileContact />
    </header>
  )

}