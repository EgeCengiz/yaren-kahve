import Reveal from './Reveal.jsx'
import ContactForm from './ContactForm.jsx'
import OpenStatus from './OpenStatus.jsx'
import beanTilted from '../assets/bean4.webp'
import './Contact.css'

const DETAILS = [
  { term: 'Tezgâh', lines: ['Yeldeğirmeni Mah. Karakolhane Cad. No: 12', 'Kadıköy / İstanbul'] },
  { term: 'Saatler', lines: ['Hafta içi 08.00 – 22.00', 'Hafta sonu 09.00 – 23.00'] },
  { term: 'E-posta', lines: ['merhaba@yaren.example'] },
]

export default function Contact() {
  return (
    <section className="contact section wood" id="iletisim">
      <div className="container contact__inner">
        <Reveal className="contact__intro">
          <p className="eyebrow eyebrow--light">İletişim</p>
          <h2 className="section-title">
            Bir kahve <em>içelim mi?</em>
          </h2>

          <OpenStatus />

          <dl className="contact__details">
            {DETAILS.map((detail) => (
              <div key={detail.term} className="contact__detail">
                <dt>{detail.term}</dt>
                {detail.lines.map((line) => (
                  <dd key={line}>{line}</dd>
                ))}
              </div>
            ))}
          </dl>

          <img src={beanTilted} alt="" aria-hidden="true" className="contact__decor-bean" />
        </Reveal>

        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
