import { useCallback, useEffect, useRef, useState } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress.js'
import { products, formatPrice } from '../data/products.js'
import sceneHome from '../assets/scene-home.jpg'
import sceneTurk from '../assets/scene-turk.jpg'
import sceneEspresso from '../assets/scene-espresso.jpg'
import sceneFiltre from '../assets/scene-filtre.jpg'
import videoTurk from '../assets/scene-turk.mp4'
import videoEspresso from '../assets/scene-espresso.mp4'
import videoFiltre from '../assets/scene-filtre.mp4'
import steam from '../assets/steam.webp'
import beanFlat from '../assets/bean1.webp'
import beanTall from '../assets/bean3.webp'
import beanTilted from '../assets/bean4.webp'
import './Hero.css'

/**
 * Hero ekrana sabitlenir; kaydırma sayfayı değil bu sahneyi ilerletir.
 * Her adımın kendi arka planı ve metni vardır; adım, ilerleme (0 → 1) `from`
 * değerini geçtiğinde görünür.
 *
 * image → fotoğraf; video varsa onun ilk karesi ve yüklenene kadarki kapağıdır
 * video → adım etkinken döngüde oynayan arka plan videosu
 * steam → (yalnızca fotoğraflı ilk adım) dumanın çıkış noktası ve genişliği (yüzde)
 */
const STEPS = [
  {
    from: 0,
    image: sceneEspresso,
    video: videoEspresso,
    alt: 'Portafiltreden cam fincana iki ince hat hâlinde akan espresso',
  },
  {
    from: 0.220,
    product: products[0],
    title: 'Közde, ağır ağır.',
    text: 'Bakır cezvede sabırla pişen, bol köpüklü bir gelenek.',
    image: sceneTurk,
    video: videoTurk,
    alt: 'Kızgın kum ve közün üzerinde köpüğü taşmak üzere olan bakır cezve',
  },
  {
    from: 0.480,
    product: products[1],
    title: 'Kısa, net, yoğun.',
    text: 'Günlük kavrum; dokuz bar basınç, yirmi sekiz saniye.',
    image: sceneHome,
    alt: 'Ahşap masanın ortasında kahverengi fincanda dumanı tüten kahve',
    steam: { x: 50, y: 49, width: 21 },
  },
  {
    from: 0.740,
    product: products[2],
    title: 'Damla damla berrak.',
    text: 'Tek kökenli çekirdekler, siparişle öğütülür ve elde demlenir.',
    image: sceneFiltre,
    video: videoFiltre,
    alt: 'Kuğu boyunlu demlikten kâğıt filtreli demleyiciye dökülen sıcak su',
    cta: true,
  },
]

/**
 * Sahnenin merkezinde eliptik bir yörüngede dönen çekirdekler.
 * start → yörüngedeki başlangıç açısı; reach → yörünge yarıçapı çarpanı;
 * spin → yörüngede bir tur atarken kendi ekseninde kaç tur döneceği.
 */
const ORBITERS = [
  { image: beanFlat, start: 10, size: 1, reach: 1, spin: 1, tilt: 0 },
  { image: beanTall, start: 70, size: 0.750, reach: 1.180, spin: -2, tilt: 40 },
  { image: beanTilted, start: 135, size: 1.150, reach: 0.920, spin: 1, tilt: 110 },
  { image: beanFlat, start: 195, size: 0.800, reach: 1.100, spin: 2, tilt: 200 },
  { image: beanTall, start: 255, size: 1.050, reach: 0.960, spin: -1, tilt: 300 },
  { image: beanTilted, start: 320, size: 0.700, reach: 1.220, spin: 2, tilt: 70 },
]

/**
 * Ekranın iki yanındaki büyük çekirdekler. Kaydırma boyunca `from` → `to`
 * arasında ilerler ve kendi etrafında tam tur (360°) döner.
 * from / to → [x (ekran genişliği %), y (sahne yüksekliği %), açı (derece)]
 * low → ekranın altındaki çekirdek; mobilde alttaki metnin üstüne gelmesin diye yukarı alınır.
 */
const GIANTS = [
  { image: beanTall, size: 1.200, blur: 0, low: true, from: [-2, 97, -20], to: [1.500, 84, 340] },
  { image: beanFlat, size: 1.050, blur: 0, from: [102, 15, 30], to: [97.500, 29, -330] },
  { image: beanTilted, size: 1.700, blur: 5, low: true, from: [110, 120, 0], to: [90, 99, 360] },
]

// Üst üste binen duman katmanları: aynı görsel, farklı gecikme ve yön.
const WISPS = [
  { delay: '0s', flip: 1 },
  { delay: '-3.300s', flip: -1 },
  { delay: '-6.600s', flip: 1 },
]

const stepAt = (progress) => STEPS.findLastIndex((step) => progress >= step.from)

const panelState = (index, activeStep) => {
  if (index === activeStep) return 'active'
  return index < activeStep ? 'past' : 'next'
}

const stepNumber = (index) => String(index).padStart(2, '0')

function DiscoverButton() {
  return (
    <a className="button" href="#kahveler">
      Kahveleri Keşfet
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M10 4v12m0 0l-5-5m5 5l5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.600"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)

  const handleProgress = useCallback((progress) => setActiveStep(stepAt(progress)), [])
  useScrollProgress(heroRef, handleProgress)

  // Yalnızca etkin adımın videosu oynar; diğerleri duraklatılır.
  const videoRefs = useRef([])
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    videoRefs.current.forEach((video, index) => {
      if (!video) return
      if (index === activeStep && !reduceMotion) video.play().catch(() => {})
      else video.pause()
    })
  }, [activeStep])

  return (
    <section className="hero" id="ust" ref={heroRef}>
      <div className="hero__stage">
        {/* Arka plan: adımların fotoğraf/videoları aynı kutuda üst üste durur,
            etkin olan görünür. İlk adımın dumanı fincanın ağzına hizalıdır. */}
        <div className="hero__scenes">
          {STEPS.map((step, index) => (
            <div key={step.from} className="hero__scene" data-active={index === activeStep}>
              {step.video ? (
                <video
                  className="hero__photo"
                  ref={(element) => {
                    videoRefs.current[index] = element
                  }}
                  src={step.video}
                  poster={step.image}
                  aria-label={step.alt}
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              ) : (
                <img
                  className="hero__photo"
                  src={step.image}
                  alt={step.alt}
                  width="2000"
                  height="1116"
                  fetchPriority="high"
                />
              )}
              {step.steam && (
                <div
                  className="hero__steam"
                  aria-hidden="true"
                  style={{
                    '--x': `${step.steam.x}%`,
                    '--y': `${step.steam.y}%`,
                    '--w': `${step.steam.width}%`,
                  }}
                >
                  {WISPS.map((wisp) => (
                    <img
                      key={wisp.delay}
                      className="hero__wisp"
                      src={steam}
                      alt=""
                      style={{ '--delay': wisp.delay, '--flip': wisp.flip }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="hero__orbit" aria-hidden="true">
            {ORBITERS.map((bean) => (
              <img
                key={bean.start}
                className="hero__orbiter"
                src={bean.image}
                alt=""
                style={{
                  '--start': `${bean.start}deg`,
                  '--size': bean.size,
                  '--reach': bean.reach,
                  '--spin': bean.spin,
                  '--tilt': `${bean.tilt}deg`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="hero__giants" aria-hidden="true">
          {GIANTS.map((bean, index) => (
            <div
              key={index}
              className={`hero__giant ${bean.low ? "hero__giant--low" : ""}`}
              style={{
                '--size': bean.size,
                '--blur': `${bean.blur}px`,
                '--x0': bean.from[0],
                '--y0': bean.from[1],
                '--r0': bean.from[2],
                '--x1': bean.to[0],
                '--y1': bean.to[1],
                '--r1': bean.to[2],
                '--float-delay': `${index * -2.100}s`,
              }}
            >
              <img src={bean.image} alt="" />
            </div>
          ))}
        </div>

        {/* Ana metin: duman ve fincanın üzerine gelmemesi için masaüstünde solda,
            mobilde altta durur. Görünmeyen paneller `inert` ile kapatılır. */}
        <div className="hero__copy">
          {STEPS.map((step, index) => (
            <div
              key={step.from}
              className="hero__panel"
              data-state={panelState(index, activeStep)}
              inert={activeStep !== index}
            >
              {index === 0 ? (
                <>
                  <p className="eyebrow eyebrow--light hero__eyebrow">Kahve evi · Kavurhane</p>
                  <h1 className="hero__title">Yâren</h1>
                  <p className="hero__slogan">Her fincanda ortak bir hikâye.</p>
                </>
              ) : (
                <>
                  <p className="eyebrow eyebrow--light hero__eyebrow">{step.product.name}</p>
                  <h2 className="hero__heading">{step.title}</h2>
                  <p className="hero__text">{step.text}</p>
                </>
              )}
              {(index === 0 || step.cta) && (
                <div className="hero__actions">
                  <DiscoverButton />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Yan bilgi: masaüstünde sağda, mobilde üst köşelerde. */}
        <div className="hero__aside">
          {STEPS.map((step, index) => (
            <div key={step.from} className="hero__panel hero__info" data-state={panelState(index, activeStep)}>
              {index === 0 ? (
                <p className="hero__intro">
                  Cezvenin sabrını, espressonun netliğini ve demlemenin inceliğini aynı tezgâhta
                  buluşturuyoruz.
                </p>
              ) : (
                <>
                  <p className="hero__numeral" aria-hidden="true">
                    {stepNumber(index)}
                  </p>
                  <p className="hero__meta">
                    <span>{step.product.method}</span>
                    <strong>{formatPrice(step.product.price)}</strong>
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        <ol className="hero__progress" aria-hidden="true">
          {STEPS.map((step, index) => (
            <li key={step.from} className={index === activeStep ? 'is-active' : ''} />
          ))}
        </ol>

        <p className={`hero__hint ${activeStep === 0 ? '' : 'hero__hint--hidden'}`} aria-hidden="true">
          Kaydır
        </p>
      </div>
    </section>
  )
}
