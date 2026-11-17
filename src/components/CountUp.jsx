import { useEffect, useRef, useState } from 'react'

const DURATION = 1400 // ms
const easeOut = (t) => 1 - (1 - t) ** 3

/** Ekrana girdiğinde 0'dan `value` değerine kadar sayan sayı. */
export default function CountUp({ value }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      setDisplay(value)
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const startedAt = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - startedAt) / DURATION, 1)
          setDisplay(Math.round(easeOut(progress) * value))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.600 },
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  // Ekran okuyucular animasyonun ara değerlerini değil, gerçek değeri okur.
  return (
    <span ref={ref}>
      <span aria-hidden="true">{display}</span>
      <span className="visually-hidden">{value}</span>
    </span>
  )
}
