import { useRouter } from 'next/router'
import Head from 'next/head'

import Profile from '../components/profile'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import Main from '../components/main'

import '../styles/global.css'
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';


export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const currentPagePath = router.pathname
  return (
    <div className="container">
      <Head>
        <title>João Portela</title>
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet"></link>
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