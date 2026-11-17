import { useEffect, useRef, useState } from 'react'
import { validateContact, validateField } from '../utils/validateContact.js'
import CupMeter from './CupMeter.jsx'

const EMPTY_VALUES = { name: '', email: '', message: '' }
const FIELD_ORDER = ['name', 'email', 'message']

const TOPICS = [
  { id: 'sohbet', label: 'Kahve & Sohbet' },
  { id: 'atolye', label: 'Tadım Atölyesi' },
  { id: 'cekirdek', label: 'Toptan Çekirdek' },
  { id: 'ortaklik', label: 'İş Birliği' },
]

const BREW_NOTES = [
  'Fincan boş · Alanları doldur, kahven demlensin.',
  'Su ısındı · İki adım kaldı.',
  'Köpüğü kabarıyor · Son bir adım.',
  'Kahven servise hazır · Gönder gitsin!',
]

const STEP_LABELS = {
  name: 'Ad',
  email: 'E-posta',
  message: 'Mesaj',
}

/** Etiket + durum rozeti + giriş + hata mesajını bir arada tutan form alanı. */
function Field({ id, label, error, isValid, as: Control = 'input', ...controlProps }) {
  const errorId = `${id}-hata`

  return (
    <div className={`field ${error ? 'field--invalid' : ''} ${isValid ? 'field--valid' : ''}`}>
      <div className="field__head">
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
        {isValid && (
          <span className="field__ok" aria-hidden="true">
            ✓ Hazır
          </span>
        )}
      </div>
      <Control
        id={id}
        className="field__control"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        {...controlProps}
      />
      {error && (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY_VALUES)
  const [topic, setTopic] = useState(TOPICS[0].id)
  const [errors, setErrors] = useState({})
  const [sentTo, setSentTo] = useState(null)
  const formRef = useRef(null)
  const successRef = useRef(null)

  useEffect(() => {
    if (sentTo) successRef.current?.focus()
  }, [sentTo])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    if (!value && !errors[name]) return
    setErrors((current) => ({ ...current, [name]: validateField(name, value) }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateContact(values)
    setErrors(nextErrors)

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field])
    if (firstInvalid) {
      formRef.current?.elements[firstInvalid]?.focus()
      return
    }

    setSentTo(values.name.trim())
    setValues(EMPTY_VALUES)
  }

  const validMap = {
    name: !validateField('name', values.name),
    email: !validateField('email', values.email),
    message: !validateField('message', values.message),
  }
  const validCount = FIELD_ORDER.filter((field) => validMap[field]).length
  const fillPercent = Math.round((validCount / FIELD_ORDER.length) * 100)

  if (sentTo) {
    return (
      <div className="contact-form contact-form--success" role="status" tabIndex={-1} ref={successRef}>
        <CupMeter level={1} served />
        <span className="contact-form__success-badge">Fincan Servis Edildi</span>
        <h3>Teşekkürler, {sentTo}!</h3>
        <p>Mesajın tezgâha ulaştı. Bir kahve molasında dönüş yapacağız.</p>
        <button type="button" className="button" onClick={() => setSentTo(null)}>
          Yeni mesaj yaz
        </button>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate ref={formRef}>
      {/* Üst: Canlı fincan doluluk göstergesi ve adım rozetleri */}
      <div className="contact-form__brew">
        <div className="contact-form__cup-wrap">
          <CupMeter level={validCount / FIELD_ORDER.length} />
          <span className="contact-form__percent" aria-hidden="true">
            %{fillPercent}
          </span>
        </div>

        <div className="contact-form__brew-info">
          <p className="contact-form__brew-note">{BREW_NOTES[validCount]}</p>
          <div className="contact-form__steps" aria-hidden="true">
            {FIELD_ORDER.map((field, index) => (
              <span
                key={field}
                className={`contact-form__step ${validMap[field] ? 'is-done' : ''}`}
              >
                <em>0{index + 1}</em> {STEP_LABELS[field]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Konu seçici haplar */}
      <div className="contact-form__topics" role="group" aria-label="Konu seçimi">
        {TOPICS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`contact-form__topic ${topic === item.id ? 'is-active' : ''}`}
            onClick={() => setTopic(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="contact-form__row">
        <Field
          id="name"
          name="name"
          label="Adın"
          type="text"
          autoComplete="name"
          placeholder="Örn. Deniz Kaya"
          value={values.name}
          error={errors.name}
          isValid={validMap.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Field
          id="email"
          name="email"
          label="E-posta"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="ad@ornek.com"
          value={values.email}
          error={errors.email}
          isValid={validMap.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <Field
        as="textarea"
        id="message"
        name="message"
        label="Mesajın"
        rows={4}
        placeholder="Birlikte ne demleyelim?"
        value={values.message}
        error={errors.message}
        isValid={validMap.message}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <button type="submit" className="button contact-form__submit">
        <span>Mesajı Gönder</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 10h12v4a6 6 0 0 1-12 0v-4Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M16 11h2a2 2 0 0 1 0 4h-2M7 6.5c0-1 1-1.5 1-2.5m4 2.5c0-1 1-1.5 1-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </form>
  )
}
