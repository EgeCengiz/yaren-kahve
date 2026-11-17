import sceneTurk from '../assets/scene-turk.jpg'
import sceneEspresso from '../assets/scene-espresso.jpg'
import sceneFiltre from '../assets/scene-filtre.jpg'
import videoTurk from '../assets/scene-turk.mp4'
import videoEspresso from '../assets/scene-espresso.mp4'
import videoFiltre from '../assets/scene-filtre.mp4'

export const products = [
  {
    id: 'turk-kahvesi',
    name: 'Türk Kahvesi',
    method: 'Cezve · Kısık ateş',
    description: 'Bakır cezvede ağır ağır pişen, bol köpüklü gelenek.',
    notes: ['Bitter çikolata', 'Kakule', 'Yoğun gövde'],
    profile: { Gövde: 5, Asidite: 2, Tatlılık: 3 },
    price: 120,
    image: sceneTurk,
    video: videoTurk,
    imageAlt: 'Kızgın kum ve közün üzerinde köpüğü kabaran bakır cezve',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    method: '9 bar · 28 saniye',
    description: 'Fındıksı kreması ve tatlı bitişiyle kısa, net bir shot.',
    notes: ['Kavrulmuş fındık', 'Karamel', 'Parlak bitiş'],
    profile: { Gövde: 4, Asidite: 3, Tatlılık: 4 },
    price: 110,
    image: sceneEspresso,
    video: videoEspresso,
    imageAlt: 'Portafiltreden cam fincana iki ince hat hâlinde akan espresso',
  },
  {
    id: 'filtre-kahve',
    name: 'Filtre Kahve',
    method: 'El demlemesi · 93°C',
    description: 'Siparişle öğütülüp elde demlenen berrak ve meyvemsi fincan.',
    notes: ['Kırmızı meyve', 'Bal', 'İpeksi içim'],
    profile: { Gövde: 2, Asidite: 4, Tatlılık: 3 },
    price: 140,
    image: sceneFiltre,
    video: videoFiltre,
    imageAlt: 'Kuğu boyunlu demlikten kâğıt filtreli demleyiciye dökülen su',
  },
]

export const PROFILE_MAX = 5

const priceFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
})

export const formatPrice = (amount) => priceFormatter.format(amount)
