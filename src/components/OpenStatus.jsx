import { useEffect, useState } from 'react'

// Çalışma saatleri: [açılış, kapanış] — hafta içi ve hafta sonu.
const HOURS = { weekday: [8, 22], weekend: [9, 23] }

const formatHour = (hour) => `${String(hour).padStart(2, '0')}.00`

function getStatus(now = new Date()) {
  const day = now.getDay()
  const [opens, closes] = day === 0 || day === 6 ? HOURS.weekend : HOURS.weekday
  const hour = now.getHours()
  const isOpen = hour >= opens && hour < closes

  return {
    isOpen,
    label: isOpen ? 'Şu an açığız' : 'Şu an kapalıyız',
    detail: isOpen ? `${formatHour(closes)}’ye kadar bekleriz` : `${formatHour(opens)}–${formatHour(closes)} arası açığız`,
  }
}

/** Ziyaretçinin saatine göre dükkânın açık olup olmadığını gösterir. */
export default function OpenStatus() {
  const [status, setStatus] = useState(getStatus)

  // Sayfa açık kaldıkça durum dakikada bir güncellenir.
  useEffect(() => {
    const timer = setInterval(() => setStatus(getStatus()), 60_000)
    return () => clearInterval(timer)
  }, [])

  return (
    <p className={`open-status ${status.isOpen ? 'open-status--open' : ''}`}>
      <span className="open-status__dot" aria-hidden="true" />
      <strong>{status.label}</strong>
      <span>{status.detail}</span>
    </p>
  )
}
