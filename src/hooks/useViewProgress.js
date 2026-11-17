import { useEffect } from 'react'

const clamp01 = (value) => Math.min(1, Math.max(0, value))

/**
 * Bir öğenin ekrandan geçişini 0 → 1 arası bir değere çevirip CSS değişkenine yazar.
 *
 * `start` ve `end`, ekran yüksekliğinin oranlarıdır (0 = üst kenar, 1 = alt kenar):
 * öğenin üst kenarı `start` çizgisine geldiğinde değer 0, alt kenarı `end`
 * çizgisine geldiğinde 1 olur. Varsayılan ayar, öğe ekrana alttan girip
 * üstten çıkana kadar geçen tüm yolu kapsar.
 */
export function useViewProgress(ref, { start = 1, end = 0, property = '--view' } = {}) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Hareket azaltma tercihinde her şey "tamamlanmış" hâliyle gösterilir.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.style.setProperty(property, '1')
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const rect = element.getBoundingClientRect()
      const viewport = window.innerHeight
      const distance = rect.height + viewport * (start - end)
      const progress = clamp01((viewport * start - rect.top) / distance)
      element.style.setProperty(property, progress.toFixed(4))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [ref, start, end, property])
}
