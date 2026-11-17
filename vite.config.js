import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Üretim çıktısının (dist/index.html) bir sunucu olmadan, doğrudan dosyaya
// çift tıklanarak (file://) açıldığında da CORS hatası vermeden çalışmasını sağlar.
function fileProtocolCompat() {
  return {
    name: 'file-protocol-compat',
    apply: 'build',
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk') {
          const code = chunk.code.replaceAll('import.meta.url', '__scriptUrl')
          chunk.code = `(function(){var __scriptUrl=(document.currentScript&&document.currentScript.src)||location.href;${code}})();\n`
        }
      }
    },
    transformIndexHtml(html) {
      return html
        .replace(/<script data-dev-only>[\s\S]*?<\/script>\s*/g, '')
        .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/g, '<script defer src="$1"></script>')
        .replace(/<link rel="stylesheet" crossorigin /g, '<link rel="stylesheet" ')
    },
  }
}

export default defineConfig({
  // Göreli taban yol: build çıktısı alt dizinde de (ör. GitHub Pages) çalışır.
  base: './',
  plugins: [react(), fileProtocolCompat()],
})
