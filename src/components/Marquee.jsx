import { useEffect, useRef } from 'react'
import './Marquee.css'

const ITEMS = ['Türk Kahvesi', 'Espresso', 'Filtre Kahve', 'Taze Kavrum', 'Uzun Sohbet']
const BASE_SPEED = 0.045 // piksel / milisaniye

/**
 * Kendi kendine akan yazı şeridi. Sayfa kaydırıldığında hızlanır, kaydırma
 * yönüne göre yön değiştirir ve hıza göre hafifçe yatar.
 */
export default function Marquee() {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let offset = 0
    let direction = -1
    let velocity = 0
    let lastScroll = window.scrollY
    let lastTime = performance.now()
    let frame = 0

    const tick = (now) => {
      const elapsed = Math.min(now - lastTime, 50)
      lastTime = now

      const delta = window.scrollY - lastScroll
      lastScroll = window.scrollY
      if (delta !== 0) direction = delta > 0 ? -1 : 1
      // Kaydırma hızını yumuşat: ani sıçramalar yerine akıcı hızlanma.
      velocity += (Math.abs(delta) - velocity) * 0.100

      offset += direction * (BASE_SPEED * elapsed + velocity * 0.400)

      // Şerit iki özdeş kopyadan oluşur; yarı genişlikte başa sararak sonsuz döner.
      const loop = track.scrollWidth / 2
      if (offset <= -loop) offset += loop
      if (offset > 0) offset -= loop

      const skew = Math.max(-8, Math.min(8, direction * velocity * 0.250))
      track.style.transform = `translate3d(${offset.toFixed(1)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" ref={trackRef}>
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee__group">
            {[...ITEMS, ...ITEMS].map((item, index) => (
              <li key={index} className="marquee__item">
                {item}
                <svg viewBox="0 0 24 24">
                  <ellipse cx="12" cy="12" rx="6" ry="9.500" transform="rotate(28 12 12)" fill="currentColor" />
                  <path
                    d="M15.200 4.500c-4.600 3.200-1.400 9-6.400 15"
                    fill="none"
                    stroke="var(--olive)"
                    strokeWidth="1.500"
                    strokeLinecap="round"
                  />
                </svg>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
