import Link from 'next/link'
import { useRouter } from 'next/router'

export default function NavigationLink({ children, href }) {
  const router = useRouter()
  const isCurrentPage = router.pathname === href

  if (isCurrentPage) {
    return <li>{children}</li>
  }

  return (
    <li>
      <Link href={href}>
        <a>{children}</a>
      </Link>
    </li>
  )
}
