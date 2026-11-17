import { useRef } from 'react'
import { useViewProgress } from '../hooks/useViewProgress.js'
import CountUp from './CountUp.jsx'
import storyImage from '../assets/story.jpg'
import './Story.css'

// Kaydırdıkça kelime kelime aydınlanan metin. Yıldız (*) ile sarılı
// kelimeler vurgulu (zeytin yeşili, italik) yazılır.
const STATEMENT =
  'Yâren; dost, yoldaş, *sohbet* *arkadaşı* demek. Aynı sofranın ortasına bir *kahve* *tezgâhı* kurduk.'

const WORDS = STATEMENT.split(' ').map((word) => ({
  text: word.replaceAll('*', ''),
  accent: word.startsWith('*'),
}))

const STATS = [
  { value: 3, unit: 'yol', title: 'Cezve · Bar · Demleme' },
  { value: 12, unit: 'köken', title: 'Günlük Taze Kavrum' },
  { value: 28, unit: 'saniye', title: 'Kusursuz Akış' },
]

const STAMP_TEXT = 'TÜRK KAHVESİ • ESPRESSO • DEMLEME • '

export default function Story() {
  const mediaRef = useRef(null)
  const statementRef = useRef(null)

  // Görsel: ekrandan geçerken paralaks + mührün dönüşü.
  useViewProgress(mediaRef)
  // Metin: ekranın alt kısmına girince başlar, ortayı geçince tamamlanır.
  useViewProgress(statementRef, { start: 0.880, end: 0.450, property: '--reveal' })

  return (
    <section className="story section" id="hikaye">
      <div className="container story__inner">
        <div className="story__media" ref={mediaRef}>
          <div className="story__frame">
            <img
              src={storyImage}
              alt="Ahşap tahtalar üzerinde kahve çekirdekleri, öğütülmüş kahve ve bir fincan latte"
              width="1200"
              height="900"
              loading="lazy"
            />
          </div>

          {/* Kaydırdıkça dönen mühür: dekoratif. */}
          <svg className="story__stamp" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path id="stamp-circle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
            </defs>
            <circle cx="60" cy="60" r="60" fill="var(--olive)" />
            <text className="story__stamp-text">
              <textPath href="#stamp-circle" textLength="270">
                {STAMP_TEXT}
              </textPath>
            </text>
            <g className="story__stamp-bean">
              <ellipse cx="60" cy="60" rx="11" ry="17" transform="rotate(28 60 60)" fill="var(--cream)" />
              <path
                d="M66 46c-8.500 6-2.500 16.500-12 28"
                fill="none"
                stroke="var(--olive)"
                strokeWidth="2.400"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        <div className="story__content">
          <p className="eyebrow">Hikâyemiz</p>

          <h2 className="story__statement" ref={statementRef} style={{ '--count': WORDS.length }}>
            {WORDS.map((word, index) => (
              <span key={index} className={word.accent ? 'is-accent' : undefined} style={{ '--i': index }}>
                {word.text}{' '}
              </span>
            ))}
          </h2>

          <ul className="story__stats">
            {STATS.map((stat) => (
              <li key={stat.title} className="story__stat">
                <p className="story__number">
                  <CountUp value={stat.value} />
                  <span>{stat.unit}</span>
                </p>
                <h3>{stat.title}</h3>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
