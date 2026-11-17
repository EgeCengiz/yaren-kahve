const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Her alan için: değer geçerliyse boş string, değilse hata mesajı döner.
const validators = {
  name: (value) => (value.trim() ? '' : 'Lütfen adınızı yazın.'),

  email: (value) => {
    const email = value.trim()
    if (!email) return 'Lütfen e-posta adresinizi yazın.'
    if (!EMAIL_PATTERN.test(email)) {
      return 'Geçerli bir e-posta adresi girin (ör. ad@ornek.com).'
    }
    return ''
  },

  message: (value) => (value.trim() ? '' : 'Lütfen mesajınızı yazın.'),
}

export function validateField(field, value) {
  return validators[field](value)
}

/** Tüm formu doğrular; yalnızca hatalı alanları içeren bir nesne döner. */
export function validateContact(values) {
  const errors = {}
  for (const field of Object.keys(validators)) {
    const error = validateField(field, values[field])
    if (error) errors[field] = error
  }
  return errors
}
