import { playVideo, pauseVideo } from '../utils/video.js'
import { useEffect, useRef } from 'react'
import Reveal from './Reveal.jsx'
import { useTilt } from '../hooks/useTilt.js'
import { products, formatPrice, PROFILE_MAX } from '../data/products.js'
import './Products.css'

/**
 * Kart görseli: fareyle üzerine gelince (dokunmatik ekranda görünür olunca)
 * kahvenin hazırlanış videosu oynar ve görsel imlece doğru eğilir.
 */
function ProductMedia({ product, index }) {
  const mediaRef = useRef(null)
  const videoRef = useRef(null)
  useTilt(mediaRef)

  useEffect(() => {
    const media = mediaRef.current
    const video = videoRef.current
    if (!media || !video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const play = () => playVideo(video)
    const pause = () => pauseVideo(video)

    if (window.matchMedia('(hover: hover)').matches) {
      media.addEventListener('pointerenter', play)
      media.addEventListener('pointerleave', pause)
      return () => {
        media.removeEventListener('pointerenter', play)
        media.removeEventListener('pointerleave', pause)
      }
    }

    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()), {
      threshold: 0.650,
    })
    observer.observe(media)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="product__media" ref={mediaRef}>
      <video
        ref={videoRef}
        src={product.video}
        poster={product.image}
        aria-label={product.imageAlt}
        muted
        loop
        playsInline
        preload="none"
      />
      <span className="product__index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="product__hint" aria-hidden="true">
        Üzerine gel, demlensin
      </span>
    </div>
  )
}

function TasteProfile({ profile }) {
  return (
    <dl className="product__profile">
      {Object.entries(profile).map(([label, value]) => (
        <div key={label} className="product__meter">
          <dt>{label}</dt>
          <dd>
            <span className="visually-hidden">
              {PROFILE_MAX} üzerinden {value}
            </span>
            <span className="product__bar" aria-hidden="true">
              <span style={{ '--level': value / PROFILE_MAX }} />
            </span>
          </dd>
        </div>
      ))}
    </dl>
  )
}

function ProductCard({ product, index }) {
  return (
    <Reveal as="article" className="product" delay={index * 120}>
      <ProductMedia product={product} index={index} />

      <div className="product__body">
        <p className="product__method">{product.method}</p>
        <div className="product__heading">
          <h3 className="product__name">{product.name}</h3>
          <p className="product__price">
            <span className="visually-hidden">Fiyat: </span>
            {formatPrice(product.price)}
          </p>
        </div>
        <p className="product__description">{product.description}</p>

        <TasteProfile profile={product.profile} />

        <ul className="product__notes" aria-label="Tadım notları">
          {product.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

export default function Products() {
  return (
    <section className="products section" id="kahveler">
      <div className="container">
        <Reveal className="products__header">
          <p className="eyebrow">Kahveler</p>
          <h2 className="section-title">Üç yol, tek tezgâh.</h2>
        </Reveal>

        <div className="products__grid">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
