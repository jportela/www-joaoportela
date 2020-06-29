import styles from './home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <p>
        👋 I&apos;m João, a Software Engineer currently living in{' '}
        <a href="https://goo.gl/maps/EHATDAAiERaEpWMm8">Porto, Portugal</a>.
        I&apos;m passionate about building well crafted, user centered
        experiences.
      </p>
      <p>
        I&apos;m developing the web app at{' '}
        <a href="https://www.fitbod.me">Fitbod</a>, an app I&apos;ve been using{' '}
        for the past year to get healthier and stronger. I&apos;ve previously{' '}
        developed great products at{' '}
        <a href="https://www.invisionapp.com/">InVisionApp</a>,{' '}
        <a href="https://www.imaginarycloud.com">Imaginary Cloud</a> and{' '}
        <a href="https://www.blip.pt">Blip</a>.
      </p>

      <p>
        I&apos;ve been told I go way too deep when learning and exploring my{' '}
        personal hobbies. I&apos;d love to chat with you about 🏃‍♂
        <a href="https://www.strava.com/athletes/joaoportela">Running</a>, 📖
        <a href="https://goodreads.com/jportela">Reading</a>, 🥘Cooking, 🎹Piano
        or 🐉FC Porto.
      </p>
    </div>
  )
}
