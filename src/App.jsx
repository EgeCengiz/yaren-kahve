import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Story from './components/Story.jsx'
import Ritual from './components/Ritual.jsx'
import Products from './components/Products.jsx'
import Roastery from './components/Roastery.jsx'
import Atmosphere from './components/Atmosphere.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import { useBeanSpill } from './hooks/useBeanSpill.js'

export default function App() {
  // Düğmelere tıklanınca altlarından kahve çekirdekleri dökülür.
  useBeanSpill()

  return (
    <>
      <a className="skip-link" href="#icerik">
        İçeriğe geç
      </a>
      <Header />
      <main id="icerik">
        <Hero />
        <Marquee />
        <Story />
        <Ritual />
        <Products />
        <Roastery />
        <Atmosphere />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
