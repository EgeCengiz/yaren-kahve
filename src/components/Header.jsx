import { useEffect, useRef, useState } from 'react'
import './Header.css'

const NAV_LINKS = [
  { id: 'hikaye', label: 'Hikâyemiz' },
  { id: 'rituel', label: 'Ritüel' },
  { id: 'kahveler', label: 'Kahveler' },
  { id: 'kavurhane', label: 'Kavurhane' },
  { id: 'meclis', label: 'Meclis' },
]
const CONTACT_ID = 'iletisim'
const SECTION_IDS = [...NAV_LINKS.map((link) => link.id), CONTACT_ID]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  // 'top'  → sayfanın en üstü: şeffaf, tam genişlik
  // 'hero' → koyu hero veya ritüel sahnesinin üzerinde: yüzen koyu cam kapsül
  // 'page' → açık renkli bölümler: yüzen krem kapsül
  const [zone, setZone] = useState('top')
  const [activeSection, setActiveSection] = useState(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const hero = document.getElementById('ust')
    const ritual = document.getElementById('rituel')
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)

    const onScroll = () => {
      // Bölge: başlığın görünümünü belirler.
      const overHero = hero ? hero.getBoundingClientRect().bottom > 72 : false
      const ritualRect = ritual?.getBoundingClientRect()
      const overRitual = ritualRect ? ritualRect.top <= 72 && ritualRect.bottom > 72 : false

      if (!overHero && !overRitual) setZone('page')
      else setZone(window.scrollY > 12 ? 'hero' : 'top')

      // Etkin bölüm: üst kenarı ekranın üst %40'ına girmiş son bölüm.
      const threshold = window.innerHeight * 0.400
      const current = sections.findLast((section) => section.getBoundingClientRect().top <= threshold)
      setActiveSection(current ? current.id : null)

      // Sayfa ilerleme çizgisi (durum yerine doğrudan stil: her karede render yok).
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      progressRef.current?.style.setProperty('transform', `scaleX(${progress.toFixed(4)})`)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Mobil menü Escape ile kapanır.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  // Mobil menü paneli krem olduğu için açıkken başlık da krem kapsüle geçer.
  const variant = menuOpen ? 'page' : zone

  return (
    <header className={`header header--${variant}`}>
      <span className="header__progress" ref={progressRef} aria-hidden="true" />

      <div className="header__bar">
        <a className="header__logo" href="#ust" onClick={closeMenu} aria-label="Yâren — sayfa başı">
          <svg className="header__mark" viewBox="0 0 24 24" aria-hidden="true">
            <ellipse cx="12" cy="12" rx="6" ry="9.500" transform="rotate(28 12 12)" fill="currentColor" />
            <path
              d="M15.200 4.500c-4.600 3.200-1.400 9-6.400 15"
              fill="none"
              stroke="var(--brown)"
              strokeWidth="1.500"
              strokeLinecap="round"
            />
          </svg>
          Yâren
        </a>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={menuOpen}
          aria-controls="ana-menu"
          aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="header__toggle-bar" />
          <span className="header__toggle-bar" />
        </button>

        <nav
          id="ana-menu"
          className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}
          aria-label="Ana menü"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              className="header__link"
              href={`#${link.id}`}
              aria-current={activeSection === link.id ? 'true' : undefined}
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
          <a
            className="header__cta"
            href={`#${CONTACT_ID}`}
            aria-current={activeSection === CONTACT_ID ? 'true' : undefined}
            data-spill
            onClick={closeMenu}
          >
            <svg className="header__cta-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 9h12v5a6 6 0 0 1-12 0V9Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M16 10h2a2.5 2.5 0 0 1 0 5h-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M7.5 5.5c0-1 1-1.5 1-2.5m3.5 2.5c0-1 1-1.5 1-2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span>Tıkla</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
