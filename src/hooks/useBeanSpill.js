import { useEffect } from 'react'
import beanFlat from '../assets/bean1.webp'
import beanTall from '../assets/bean3.webp'
import beanTilted from '../assets/bean4.webp'

const IMAGES = [beanFlat, beanTall, beanTilted]
const BEAN_COUNT = 18
const TRIGGER_SELECTOR = '.button, [data-spill]'

const random = (min, max) => min + Math.random() * (max - min)

/** Verilen düğmenin alt kenarından aşağı dökülen çekirdekler oluşturur. */
function spillBeans(button) {
  const rect = button.getBoundingClientRect()

  for (let i = 0; i < BEAN_COUNT; i++) {
    const size = random(20, 42)
    const duration = random(900, 1600)
    const delay = random(0, 220)

    // Dış öğe yatay savrulmayı, içteki görsel düşüşü ve dönüşü taşır;
    // iki ayrı yumuşatma eğrisi birlikte yay biçiminde bir düşüş verir.
    const holder = document.createElement('span')
    holder.className = 'spill'
    holder.style.left = `${rect.left + rect.width * random(0.120, 0.880)}px`
    holder.style.top = `${rect.bottom - 4}px`

    const bean = document.createElement('img')
    bean.src = IMAGES[i % IMAGES.length]
    bean.alt = ''
    bean.style.width = `${size}px`
    bean.style.marginLeft = `${-size / 2}px`
    holder.append(bean)
    document.body.append(holder)

    const timing = { duration, delay, fill: 'both' }
    holder.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(${random(-0.600, 0.600) * rect.width}px)` }],
      { ...timing, easing: 'ease-out' },
    )
    const fall = bean.animate(
      [
        { transform: 'translateY(-6px) rotate(0deg)', opacity: 0 },
        { opacity: 1, offset: 0.120 },
        { opacity: 1, offset: 0.750 },
        {
          transform: `translateY(${random(220, 480)}px) rotate(${random(-720, 720)}deg)`,
          opacity: 0,
        },
      ],
      { ...timing, easing: 'cubic-bezier(0.450, 0, 0.900, 0.550)' },
    )

    fall.finished.finally(() => holder.remove())
  }
}

/**
 * Sayfadaki düğmelere (`.button` veya `data-spill`) tıklandığında altlarından
 * kahve çekirdekleri döker. Tek bir belge düzeyi dinleyici kullanır, böylece
 * sonradan eklenen düğmeler de kapsanır.
 */
export function useBeanSpill() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onClick = (event) => {
      const button = event.target.closest?.(TRIGGER_SELECTOR)
      if (button) spillBeans(button)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
