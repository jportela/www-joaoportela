import GithubIcon from '../../icons/github.svg'
import TwitterIcon from '../../icons/twitter.svg'
import LinkedinIcon from '../../icons/linkedin.svg'
import CvIcon from '../../icons/cv.svg'

import styles from './contact.module.css'

const CONTACTS = [
  {
    href: 'https://github.com/jportela',
    Icon: GithubIcon,
    description: 'GitHub'
  },
  {
    href: 'https://twitter.com/joaoppcportela',
    Icon: TwitterIcon,
    description: 'Twitter'
  },
  {
    href: 'https://www.linkedin.com/in/joaoportela/',
    Icon: LinkedinIcon,
    description: 'LinkedIn'
  },
  {
    href: '/cv.html',
    Icon: CvIcon,
    description: 'CV'
  }
]

export default function ProfileContact () {
  const renderedContacts = CONTACTS.map((contact, i) => (
    <li className={styles.item} key={`contact-${i}`}>
      <a className={styles.icon} href={contact.href} title={contact.description}>
        <contact.Icon />
        <span className={styles.description}>{contact.description}</span>
      </a>
    </li>
  ))

  return (
    <ul className={styles.container}>
      {renderedContacts}
    </ul>
  )
}
