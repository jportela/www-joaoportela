import { useRouter } from 'next/router'
import Head from 'next/head'

import Profile from '../components/profile'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import Main from '../components/main'

import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import '../styles/global.css'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const currentPagePath = router.pathname
  return (
    <div className="container">
      <Head>
        <title>João Portela</title>
        <meta charset="utf-8" />
        <meta name="author" content="João Portela" />
        <meta name="description" content="I’m João, a Software Engineer currently living in Porto, Portugal. I'm passionate about well crafted experiences, that make people’s lives easier." />

        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="page">
        <header>
          <Profile />
        </header>
        <div className="content">
          <nav>
            <Navigation currentPagePath={currentPagePath}/>
          </nav>
          <Main>
            <Component {...pageProps} />
          </Main>
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}