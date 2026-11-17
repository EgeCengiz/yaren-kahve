import { useEffect, useRef, useState } from 'react'
import { useViewProgress } from '../hooks/useViewProgress.js'
import Reveal from './Reveal.jsx'
import sceneEspresso from '../assets/scene-espresso.jpg'
import sceneFiltre from '../assets/scene-filtre.jpg'
import sceneTurk from '../assets/scene-turk.jpg'
import videoEspresso from '../assets/scene-espresso.mp4'
import videoFiltre from '../assets/scene-filtre.mp4'
import videoTurk from '../assets/scene-turk.mp4'
import './Atmosphere.css'

const MOMENTS = [
  {
    id: 'sabah',
    time: '08.00',
    title: 'Sabah Kavrumu',
    tag: 'Taze Espresso · 9 Bar',
    image: sceneEspresso,
    video: videoEspresso,
    alt: 'Sabah ışığında portafiltreden süzülen taze espresso',
  },
  {
    id: 'ogle',
    time: '13.30',
    title: 'Öğle Demlemesi',
    tag: 'El Demlemesi · V60',
    image: sceneFiltre,
    video: videoFiltre,
    alt: 'Kuğu boyunlu demlikle yavaşça demlenen filtre kahve',
  },
  {
    id: 'aksam',
    time: '19.30',
    title: 'Akşam Meclisi',
    tag: 'Közde Bakır Cezve',
    image: sceneTurk,
    video: videoTurk,
    alt: 'Akşam ışığında kızgın kumda pişen bakır cezve',
  },
]

function MomentCard({ moment, isSelected, onSelect }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    if (isSelected) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isSelected])

  return (
    <article
      className={`atmosphere__card ${isSelected ? 'is-selected' : ''}`}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
    >
      <video
        ref={videoRef}
        src={moment.video}
        poster={moment.image}
        aria-label={moment.alt}
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="atmosphere__shade" aria-hidden="true" />

      <div className="atmosphere__top">
        <span className="atmosphere__time-badge">{moment.time}</span>
        <span className="atmosphere__live-indicator" aria-hidden="true">
          <span className="atmosphere__live-dot" />
          {isSelected ? 'Canlı' : 'Oynat'}
        </span>
      </div>

      <div className="atmosphere__caption">
        <p className="atmosphere__tag">{moment.tag}</p>
        <h3 className="atmosphere__title">{moment.title}</h3>
      </div>
    </article>
  )
}

export default function Atmosphere() {
  const sectionRef = useRef(null)
  const [selectedId, setSelectedId] = useState(MOMENTS[0].id)

  useViewProgress(sectionRef, { start: 1, end: 0, property: '--atmo' })

  return (
    <section className="atmosphere section" id="meclis" ref={sectionRef}>
      <div className="atmosphere__bg-word" aria-hidden="true">
        SABAH · ÖĞLE · AKŞAM · YÂREN
      </div>

      <div className="container">
        <Reveal className="atmosphere__header">
          <p className="eyebrow">Yâren Meclisi</p>
          <h2 className="section-title">
            Günün üç vakti, <em>üç canlı sahne.</em>
          </h2>
        </Reveal>

        <div className="atmosphere__grid">
          {MOMENTS.map((moment) => (
            <MomentCard
              key={moment.id}
              moment={moment}
              isSelected={selectedId === moment.id}
              onSelect={() => setSelectedId(moment.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
