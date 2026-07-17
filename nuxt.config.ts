// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-06-30',
  future: { compatibilityVersion: 4 },

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
      ],
      script: [
        {
          // Koyu tema tercihini hidrasyondan önce uygula (açılışta beyaz titreme olmasın)
          innerHTML: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          tagPosition: 'head'
        }
      ]
    }
  },

  modules: [
    '@nuxtjs/tailwindcss', 
    '@vite-pwa/nuxt', 
    '@vercel/analytics/nuxt'
  ],

  tailwindcss: {
    config: {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
          },
          colors: {
            brand: {
              navy: '#0A1159',
              bordo: '#5D0001',
              dark: '#00031A',
              ice: '#AEE9FF'
            }
          }
        }
      }
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'CONF 2026 EYP Türkiye',
      short_name: 'CONF 2026',
      description: 'Istanbul 2026 5th National Session of EYP Türkiye Dashboard',
      theme_color: '#00031A',
      background_color: '#00031A',
      display: 'standalone',
      icons: [
        {
          src: '/favicon.ico',
          sizes: '64x64 32x32 24x24 16x16',
          type: 'image/x-icon'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    }
  }
})