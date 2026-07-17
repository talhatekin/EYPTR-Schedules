// server/api/auth.post.ts
import { redis } from '../utils/redis'
import { adminTokenKey, ADMIN_TOKEN_TTL } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const realPassword = process.env.ADMIN_SECRET_PASSWORD || '123'

  if (body?.password !== realPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Şifre doğruysa doğrulanabilir rastgele bir token üret ve KV'de sakla.
  // Yazma uçları (assertAdmin) bu token'ın varlığını kontrol eder.
  const token = crypto.randomUUID()
  await redis.set(adminTokenKey(token), '1', { ex: ADMIN_TOKEN_TTL })

  return { success: true, token }
})
