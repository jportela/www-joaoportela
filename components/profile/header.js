import styles from './header.module.css'

export default function ProfileHeader() {
  return (
    <div className={styles.container}>
      <img src="/jportela.jpg" alt="Joao's Photo" className={styles.photo} />
      <h1 className={styles.name}>João Portela</h1>
    </div>
  )
}
