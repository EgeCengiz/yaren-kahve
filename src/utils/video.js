import videoTurk from '../assets/scene-turk.mp4'
import videoEspresso from '../assets/scene-espresso.mp4'
import videoFiltre from '../assets/scene-filtre.mp4'
import loopTurk from '../assets/scene-turk-loop.webp'
import loopEspresso from '../assets/scene-espresso-loop.webp'
import loopFiltre from '../assets/scene-filtre-loop.webp'

/**
 * Arka plan videolarını mobil tarayıcılarda da kendiliğinden oynatır.
 *
 * - iOS Safari yalnızca sessiz ve satır içi videoyu kendiliğinden başlatır; React `muted`
 *   özelliğini HTML'e yazmadığı için burada açıkça işaretlenir.
 * - Tarayıcı otomatik oynatmayı tümden engelliyorsa (ör. düşük güç modu, veri tasarrufu)
 *   videonun yerine aynı döngünün hareketli WebP görseli konur: görseller izin gerektirmez,
 *   böylece kullanıcının dokunmasına gerek kalmaz.
 */
const LOOPS = [
  [videoTurk, loopTurk],
  [videoEspresso, loopEspresso],
  [videoFiltre, loopFiltre],
]

const absolute = (url) => new URL(url, document.baseURI).href
const loopFor = (video) => {
  const current = video.currentSrc || video.src
  return LOOPS.find(([source]) => absolute(source) === current)?.[1]
}

// Oynaması istenen videolar: engellenip engellenmediklerini anlamak için izlenir.
const wanted = new WeakSet()

function swapForImage(video) {
  if (video.dataset.swapped) return
  const loop = loopFor(video)
  if (!loop) return

  const image = document.createElement('img')
  image.className = `${video.className} video-fallback`.trim()
  image.alt = video.getAttribute('aria-label') || ''
  image.decoding = 'async'
  image.src = loop
  video.dataset.swapped = 'true'
  video.hidden = true
  video.after(image)
}

export function playVideo(video) {
  if (video.dataset.swapped) return

  video.muted = true
  video.defaultMuted = true
  video.playsInline = true
  video.setAttribute('muted', '')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', '')
  wanted.add(video)

  const attempt = video.play()
  if (!attempt) return
  attempt.catch((error) => {
    // AbortError: oynatma başlamadan duraklatıldı; engel değil.
    if (error?.name === 'AbortError' || !wanted.has(video)) return
    swapForImage(video)
  })

  // Bazı tarayıcılar reddetmek yerine sessizce bekletir: video hâlâ başlamadıysa görsele geç.
  window.setTimeout(() => {
    if (wanted.has(video) && video.paused && video.readyState >= 2) swapForImage(video)
  }, 1500)
}

export function pauseVideo(video) {
  wanted.delete(video)
  if (!video.dataset.swapped) video.pause()
}
