const CUP_TOP = 28
const CUP_DEPTH = 58

/**
 * Form doldukça kahveyle dolan fincan.
 * level  → doluluk oranı (0 – 1)
 * served → true olduğunda fincandan duman tüter (mesaj gönderildi)
 */
export default function CupMeter({ level, served = false }) {
  // Sıvı, fincanın içini kırpan bir maskenin arkasında yukarı doğru kayar.
  const offset = (1 - level) * CUP_DEPTH

  return (
    <svg className={`cup ${served ? 'cup--served' : ''}`} viewBox="0 0 120 104" aria-hidden="true">
      <defs>
        <clipPath id="cup-inside">
          <path d="M22 28H88V52C88 74 72 86 55 86C38 86 22 74 22 52Z" />
        </clipPath>
      </defs>

      <g className="cup__steam">
        <path d="M44 20c-5-6 5-9 0-16" />
        <path d="M56 20c-5-6 5-9 0-16" />
        <path d="M68 20c-5-6 5-9 0-16" />
      </g>

      <g clipPath="url(#cup-inside)">
        <g className="cup__liquid" style={{ transform: `translateY(${offset}px)` }}>
          <rect x="22" y={CUP_TOP} width="66" height={CUP_DEPTH + 4} />
          {/* Yüzeydeki dalga: iki tam dalga boyu, yatayda kayarak döner. */}
          <path
            className="cup__wave"
            d="M-11 28q8.250-5 16.500 0t16.500 0 16.500 0 16.500 0 16.500 0 16.500 0 16.500 0 16.500 0V34H-11Z"
          />
        </g>
      </g>

      <path className="cup__outline" d="M22 28H88V52C88 74 72 86 55 86C38 86 22 74 22 52Z" />
      <path className="cup__outline" d="M88 36h7a12 12 0 0 1 0 24h-8" />
      <path className="cup__outline" d="M12 96H98" />
    </svg>
  )
}
