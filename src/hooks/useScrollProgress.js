import { useEffect } from 'react'

const clamp01 = (value) => Math.min(1, Math.max(0, value))

/**
 * Bir bölümün kaydırma ilerlemesini (0 → 1) hesaplar.
 *
 * Bölüm ekrandan uzun olmalıdır: ilerleme, bölümün üst kenarı ekranın üstüne
 * değdiğinde 0, alt kenarı ekranın altına değdiğinde 1 olur. Değer, hareketin
 * akıcı görünmesi için her karede hedefe doğru yumuşatılarak `--p` CSS
 * değişkenine yazılır ve `onProgress` ile bildirilir.
 */
export function useScrollProgress(ref, onProgress) {
  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let target = 0
    let current = 0
    let frame = 0

    const tick = () => {
      current += (target - current) * 0.140
      if (Math.abs(target - current) < 0.0005) current = target

      element.style.setProperty('--p', current.toFixed(4))
      onProgress?.(current)

      frame = current === target ? 0 : requestAnimationFrame(tick)
    }

    const measure = () => {
      const rect = element.getBoundingClientRect()
      const range = rect.height - window.innerHeight
      target = range > 0 ? clamp01(-rect.top / range) : 0
      if (!frame) frame = requestAnimationFrame(tick)
    }

    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(frame)
    }
  }, [ref, onProgress])
}
