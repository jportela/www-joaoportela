import { useRouter } from 'next/router'
import Head from 'next/head'

import Profile from '../components/profile'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import Main from '../components/main'

import 'highlight.js/styles/tomorrow-night.css';
import '../styles/global.css'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const currentPagePath = router.pathname
  return (
    <div className="container">
      <Head>
        <title>João Portela</title>
        <meta charSet="utf-8" />
        <meta name="author" content="João Portela" />
        <meta name="description" content="I’m João, a Software Engineer currently living in Porto, Portugal. I’m passionate about building well crafted, user centered experiences." />

        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="page">
        <Profile />
        <div className="content">
          <Navigation currentPagePath={currentPagePath}/>
          <Main>
            <Component {...pageProps} />
          </Main>
        </div>
      </div>
      <Footer />
    </div>
  )
}