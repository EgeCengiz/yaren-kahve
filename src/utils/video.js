/**
 * Arka plan videolarını mobil tarayıcılarda da güvenle oynatır.
 *
 * - iOS Safari sessiz ve satır içi olmayan videoyu kendiliğinden başlatmaz; React `muted`
 *   özelliğini HTML'e yazmadığı için burada açıkça işaretlenir.
 * - Tarayıcı yine de engellerse (ör. düşük güç modu) video, kullanıcının ilk dokunuşunda başlar.
 */
const waiting = new Set()
let listening = false

const resume = () => {
  waiting.forEach((video) => {
    video
      .play()
      .then(() => waiting.delete(video))
      .catch(() => {})
  })
}

const listen = () => {
  if (listening) return
  listening = true
  for (const type of ['touchend', 'pointerup', 'click', 'keydown']) {
    document.addEventListener(type, resume, { passive: true })
  }
}

export function playVideo(video) {
  video.muted = true
  video.defaultMuted = true
  video.playsInline = true
  video.setAttribute('muted', '')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', '')

  const attempt = video.play()
  if (!attempt) return
  attempt.catch((error) => {
    // AbortError: oynatma başlamadan duraklatıldı; beklemeye almaya gerek yok.
    if (error?.name === 'AbortError') return
    waiting.add(video)
    listen()
  })
}

export function pauseVideo(video) {
  waiting.delete(video)
  video.pause()
}
