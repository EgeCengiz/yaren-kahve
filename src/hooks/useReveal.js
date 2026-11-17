import { useEffect, useRef } from 'react'

/**
 * Eleman görünür alana girdiğinde `is-visible` sınıfını ekler.
 * CSS tarafındaki `.reveal` sınıfıyla birlikte yumuşak bir giriş animasyonu sağlar.
 */
export function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (!('IntersectionObserver' in window)) {
      element.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return ref
}
