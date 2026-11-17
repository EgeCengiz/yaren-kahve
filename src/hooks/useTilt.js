import { useEffect } from 'react'

const MAX_TILT = 9 // derece

/**
 * Fare öğenin üzerinde gezdikçe öğeyi imlece doğru hafifçe eğer.
 * Açıları ve imleç konumunu CSS değişkenlerine yazar; görsel etki CSS'tedir:
 *   --rx, --ry → eğim açıları      --mx, --my → imlecin öğe içindeki konumu (%)
 */
export function useTilt(ref) {
  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (event) => {
      if (event.pointerType !== 'mouse') return
      const rect = element.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height

      element.style.setProperty('--ry', `${((x - 0.500) * 2 * MAX_TILT).toFixed(2)}deg`)
      element.style.setProperty('--rx', `${((0.500 - y) * 2 * MAX_TILT).toFixed(2)}deg`)
      element.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
      element.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
    }
    const onLeave = () => {
      element.style.setProperty('--rx', '0deg')
      element.style.setProperty('--ry', '0deg')
    }

    element.addEventListener('pointermove', onMove)
    element.addEventListener('pointerleave', onLeave)
    return () => {
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerleave', onLeave)
    }
  }, [ref])
}
