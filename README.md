# Istanbul NS 26 — Conference Dashboard

EYP Türkiye Istanbul 2026 5. Ulusal Oturumu için konferans dashboard'u.
Nuxt 4 + Nuxt UI + Tailwind ile geliştirildi.

Public sayfalar: **Feed** (duyurular ve günlük hatırlatma), **Schedule**
(delege/official programı, canlı oturum vurgusu), **Feedback** (delege geri bildirim formu).
`/admin` sayfası şifre korumalı yönetim panelidir (program, duyuru, hatırlatma, Excel içe/dışa aktarım).

## Setup

```bash
pnpm install
```

## Geliştirme

```bash
pnpm dev   # http://localhost:3000
```

## Depolama kurulumu (Vercel + Upstash Redis)

Veriler Redis'te (Upstash) tutulur. İçerik `conf_data` anahtarında, delege
feedback'leri ise `conf_feedbacks` listesinde saklanır.

1. Vercel projesinde **Storage → Marketplace → Upstash** üzerinden bir **Redis**
   veritabanı ekleyip projeye bağla. Bu, `KV_REST_API_URL` ve `KV_REST_API_TOKEN`
   değişkenlerini otomatik ekler.
2. **Environment Variables** altına `ADMIN_SECRET_PASSWORD` ekle (admin panel şifresi).
   Ayarlanmazsa güvensiz varsayılan `123` kullanılır — mutlaka değiştir.
3. Yerelde test için `.env.example`'ı `.env`'e kopyalayıp değerleri doldur.

Değişken adları için `.env.example` dosyasına bak. `UPSTASH_REDIS_REST_URL` /
`UPSTASH_REDIS_REST_TOKEN` adları da desteklenir.

## Güvenlik notu

`POST /api/data` (içerik kaydetme) ve `DELETE /api/feedback` (feedback silme) uçları,
admin girişinde üretilen token ile korunur. Feedback gönderimi (`POST /api/feedback`)
herkese açıktır ve atomik `lpush` ile eklenir; admin içeriği kaydettiğinde
feedback'ler asla ezilmez.

## Production

```bash
pnpm build
pnpm preview
```

Deployment için [Nuxt deployment dokümanı](https://nuxt.com/docs/getting-started/deployment).
