import styles from './navigation.module.css'
import NavigationLink from './link'
import ProfileHeader from '../profile/header'
import ProfileContact from '../profile/contact'

export default function Navigation() {
  return (
    <nav className={styles.container}>
      <ul className={styles.list}>
        <NavigationLink href="/">
          <ProfileHeader />
        </NavigationLink>
        <NavigationLink href="/blog">Blog</NavigationLink>
      </ul>
      <ProfileContact />
    </nav>
  )
}
