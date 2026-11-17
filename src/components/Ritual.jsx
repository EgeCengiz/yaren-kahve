import { useCallback, useEffect, useRef, useState } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress.js'
import sceneTurk from '../assets/scene-turk.jpg'
import sceneEspresso from '../assets/scene-espresso.jpg'
import sceneFiltre from '../assets/scene-filtre.jpg'
import videoTurk from '../assets/scene-turk.mp4'
import videoEspresso from '../assets/scene-espresso.mp4'
import videoFiltre from '../assets/scene-filtre.mp4'
import beanFlat from '../assets/bean1.webp'
import beanTall from '../assets/bean3.webp'
import beanTilted from '../assets/bean4.webp'
import './Ritual.css'

const RITUAL_STEPS = [
  {
    id: 'cezve',
    numeral: '01',
    badge: 'Bakır Cezve',
    title: 'Közde Ağır Ateş',
    line: 'Kızgın kumda ağır ağır yükselen kadifemsi köpük.',
    image: sceneTurk,
    video: videoTurk,
    alt: 'Kızgın kum ve köz üzerinde ağır ağır köpüren bakır cezve',
    specs: [
      { label: 'Isı', value: '88°C' },
      { label: 'Süre', value: '2 dk 40 sn' },
      { label: 'Oran', value: '1 : 10' },
    ],
  },
  {
    id: 'espresso',
    numeral: '02',
    badge: 'Espresso Bar',
    title: '9 Bar · 28 Saniye',
    line: 'Çift oluktan süzülen yoğun gövde ve fındıksı krema.',
    image: sceneEspresso,
    video: videoEspresso,
    alt: 'Portafiltreden cam fincana iki ince hat hâlinde akan espresso',
    specs: [
      { label: 'Basınç', value: '9 Bar' },
      { label: 'Akış', value: '28 sn' },
      { label: 'Oran', value: '18g → 36g' },
    ],
  },
  {
    id: 'filtre',
    numeral: '03',
    badge: 'El Demlemesi',
    title: 'Damla Damla Berrak',
    line: 'Üç aşamalı spiral döküşle açığa çıkan çiçeksi aromalar.',
    image: sceneFiltre,
    video: videoFiltre,
    alt: 'Kuğu boyunlu demlikten kâğıt filtreli demleyiciye dökülen sıcak su',
    specs: [
      { label: 'Isı', value: '93°C' },
      { label: 'Demleme', value: '3 dk 10 sn' },
      { label: 'Oran', value: '1 : 15' },
    ],
  },
]

const FLOATING_BEANS = [
  { image: beanFlat, side: 'left', top: 18, size: 1, rotateStart: -25, rotateEnd: 165, yShift: -80 },
  { image: beanTall, side: 'right', top: 24, size: 0.85, rotateStart: 35, rotateEnd: -145, yShift: -110 },
  { image: beanTilted, side: 'left', top: 76, size: 1.1, rotateStart: 15, rotateEnd: 210, yShift: -95 },
]

export default function Ritual() {
  const sectionRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const videoRefs = useRef([])

  const handleProgress = useCallback((progress) => {
    const nextIndex = Math.min(RITUAL_STEPS.length - 1, Math.floor(progress * RITUAL_STEPS.length))
    setActiveIndex(nextIndex)
  }, [])

  useScrollProgress(sectionRef, handleProgress)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    videoRefs.current.forEach((video, index) => {
      if (!video) return
      if (index === activeIndex && !reduceMotion) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [activeIndex])

  const scrollToStep = (index) => {
    const section = sectionRef.current
    if (!section) return
    const rect = section.getBoundingClientRect()
    const totalScrollable = section.offsetHeight - window.innerHeight
    if (totalScrollable <= 0) {
      setActiveIndex(index)
      return
    }
    const targetProgress = (index + 0.35) / RITUAL_STEPS.length
    const targetY = window.scrollY + rect.top + totalScrollable * targetProgress
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }

  return (
    <section className="ritual" id="rituel" ref={sectionRef} aria-label="Demleme Ritüeli">
      <div className="ritual__stage">
        <div className="ritual__beans" aria-hidden="true">
          {FLOATING_BEANS.map((bean, index) => (
            <img
              key={index}
              className={`ritual__bean ritual__bean--${bean.side}`}
              src={bean.image}
              alt=""
              style={{
                '--top': `${bean.top}%`,
                '--size': bean.size,
                '--r0': `${bean.rotateStart}deg`,
                '--r1': `${bean.rotateEnd}deg`,
                '--dy': `${bean.yShift}px`,
              }}
            />
          ))}
        </div>

        <div className="container ritual__inner">
          <div className="ritual__top">
            <div className="ritual__tabs" role="tablist" aria-label="Demleme yöntemleri">
              {RITUAL_STEPS.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === index}
                  className={`ritual__tab ${activeIndex === index ? 'is-active' : ''}`}
                  onClick={() => scrollToStep(index)}
                >
                  <span className="ritual__tab-num">{step.numeral}</span>
                  <span>{step.badge}</span>
                </button>
              ))}
            </div>

            <div className="ritual__scrubber" aria-hidden="true">
              <div className="ritual__scrubber-track">
                <div className="ritual__scrubber-fill" />
              </div>
            </div>
          </div>

          {/* Tam genişlikte sinematik video sahnesi + minimal HUD */}
          <div className="ritual__viewport">
            {RITUAL_STEPS.map((step, index) => (
              <div
                key={step.id}
                className="ritual__video-layer"
                data-active={activeIndex === index}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el
                  }}
                  src={step.video}
                  poster={step.image}
                  aria-label={step.alt}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
            ))}

            <div className="ritual__shade" aria-hidden="true" />

            {RITUAL_STEPS.map((step, index) => (
              <div
                key={step.id}
                className="ritual__overlay"
                data-state={
                  index === activeIndex ? 'active' : index < activeIndex ? 'past' : 'next'
                }
                inert={activeIndex !== index}
              >
                <div className="ritual__overlay-copy">
                  <span className="ritual__step-num" aria-hidden="true">
                    {step.numeral}
                  </span>
                  <h2 className="ritual__title">{step.title}</h2>
                  <p className="ritual__line">{step.line}</p>
                </div>

                <dl className="ritual__specs">
                  {step.specs.map((spec) => (
                    <div key={spec.label} className="ritual__spec">
                      <dt>{spec.label}</dt>
                      <dd>{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
