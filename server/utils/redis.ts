import { Redis } from '@upstash/redis'

// Vercel'in Upstash (Marketplace) entegrasyonu KV_REST_API_* değişkenlerini,
// doğrudan Upstash bağlantısı ise UPSTASH_REDIS_REST_* değişkenlerini yazar.
// İkisini de destekleyelim ki her iki kurulumda da çalışsın.
export const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

// Env değişkenleri yoksa (yerel geliştirme) yazma uçları anlamlı hata döndürsün.
export const isRedisConfigured = () =>
  Boolean(
    (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) &&
    (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)
  )
