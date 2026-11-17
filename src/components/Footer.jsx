import { useRef } from 'react'
import { useViewProgress } from '../hooks/useViewProgress.js'
import beanFlat from '../assets/bean1.webp'
import beanTall from '../assets/bean3.webp'
import './Footer.css'

const LINKS = [
  { href: '#hikaye', label: 'Hikâyemiz' },
  { href: '#rituel', label: 'Ritüel' },
  { href: '#kahveler', label: 'Kahveler' },
  { href: '#kavurhane', label: 'Kavurhane' },
  { href: '#meclis', label: 'Meclis' },
  { href: '#iletisim', label: 'İletişim' },
]

const WORDMARK = [...'Yâren']

export default function Footer() {
  const footerRef = useRef(null)

  useViewProgress(footerRef, { start: 1, end: 1 })

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer__glow" aria-hidden="true" />

      <div className="footer__beans" aria-hidden="true">
        <img src={beanFlat} alt="" className="footer__bean footer__bean--left" />
        <img src={beanTall} alt="" className="footer__bean footer__bean--right" />
      </div>

      <div className="container footer__inner">
        <div className="footer__top">
          <p className="footer__slogan">Her fincanda ortak bir hikâye.</p>

          <nav className="footer__nav" aria-label="Alt menü">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <a className="button footer__top-link" href="#ust">
            Başa dön
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M10 16V4m0 0l-5 5m5-5l5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.600"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      <p className="footer__wordmark" aria-hidden="true">
        {WORDMARK.map((letter, index) => (
          <span key={index} style={{ '--i': index }}>
            {letter}
          </span>
        ))}
      </p>

      <div className="container">
        <p className="footer__note">
          © {new Date().getFullYear()} Yâren · Kadıköy / İstanbul
        </p>
      </div>
    </footer>
  )
}
