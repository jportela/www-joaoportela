import * as styles from './main.module.css'

export default function Main ({ children }) {
  return (
    <main role='main' className={styles.container}>
      {children}
    </main>
  )
}
