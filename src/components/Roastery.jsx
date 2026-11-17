import Reveal from './Reveal.jsx'
import beanFlat from '../assets/bean1.webp'
import beanTall from '../assets/bean3.webp'
import beanTilted from '../assets/bean4.webp'
import './Roastery.css'

const ORIGINS = [
  {
    id: 'yirgacheffe',
    region: 'Etiyopya · Yirgacheffe',
    altitude: '2.050 m · Yıkanmış',
    roastLevel: 'Açık Kavrum',
    roastPercent: 38,
    beanImage: beanTall,
    aromas: [
      { name: 'Yasemin & Bergamot', score: 92 },
      { name: 'Kırmızı Meyve', score: 84 },
      { name: 'Gövde', score: 45 },
    ],
  },
  {
    id: 'huila',
    region: 'Kolombiya · Huila',
    altitude: '1.800 m · Doğal',
    roastLevel: 'Orta Kavrum',
    roastPercent: 65,
    beanImage: beanFlat,
    aromas: [
      { name: 'Karamel & Fındık', score: 90 },
      { name: 'Sütlü Çikolata', score: 85 },
      { name: 'Gövde', score: 78 },
    ],
  },
  {
    id: 'harman',
    region: 'Brezilya · Cerrado',
    altitude: '1.250 m · Güneşte Kurutma',
    roastLevel: 'Koyu Cezve Kavrumu',
    roastPercent: 86,
    beanImage: beanTilted,
    aromas: [
      { name: 'Bitter Çikolata', score: 95 },
      { name: 'Kakule & Ceviz', score: 84 },
      { name: 'Gövde', score: 96 },
    ],
  },
]

export default function Roastery() {
  return (
    <section className="roastery section" id="kavurhane">
      <div className="container">
        <Reveal className="roastery__header">
          <p className="eyebrow">Kavurhane & Köken</p>
          <h2 className="section-title">
            Üç köken, <em>üç kavrum profili.</em>
          </h2>
        </Reveal>

        <div className="roastery__cards">
          {ORIGINS.map((origin, index) => (
            <Reveal key={origin.id} as="article" className="roastery__card" delay={index * 100}>
              <div className="roastery__card-visual">
                <span className="roastery__altitude">{origin.altitude}</span>
                <img src={origin.beanImage} alt={origin.region} className="roastery__bean-img" />
                <div className="roastery__roast-bar">
                  <div className="roastery__roast-labels">
                    <span>Açık</span>
                    <strong>{origin.roastLevel}</strong>
                    <span>Koyu</span>
                  </div>
                  <div className="roastery__roast-track" aria-hidden="true">
                    <span style={{ left: `${origin.roastPercent}%` }} />
                  </div>
                </div>
              </div>

              <div className="roastery__card-body">
                <h3 className="roastery__card-title">{origin.region}</h3>

                <div className="roastery__aroma-bars">
                  {origin.aromas.map((aroma) => (
                    <div key={aroma.name} className="roastery__aroma-item">
                      <div className="roastery__aroma-row">
                        <span>{aroma.name}</span>
                        <span>%{aroma.score}</span>
                      </div>
                      <div className="roastery__aroma-bar" aria-hidden="true">
                        <span style={{ width: `${aroma.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
