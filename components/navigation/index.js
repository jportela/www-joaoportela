import Link from 'next/link'
import { useRouter } from 'next/router'

import * as styles from './navigation.module.css'

const NAVIGATION = [
  {
    href: '/',
    label: 'Home'
  },
  {
    href: '/blog',
    label: 'Blog'
  },
  {
    href: '/projects',
    label: 'Projects'
  },
  {
    href: '/about',
    label: 'About'
  },
]

export default function Navigation() {
  const router = useRouter()
  const renderedNavigation = NAVIGATION.map((navigation, i) => {
    const isCurrentPage = router.pathname === navigation.href
    return (
      <li key={`navigation-${i}`}>
        { isCurrentPage ?
          navigation.label : (
          <Link href={navigation.href}>
            <a>{navigation.label}</a>
          </Link>
        )}
      </li>
    )
  })
  return (
    <nav>
      <ul className={styles.navigationLinks}>
        {renderedNavigation}
      </ul>
    </nav>
  )
}