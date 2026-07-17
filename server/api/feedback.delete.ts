import { redis } from '../utils/redis'
import { assertAdmin } from '../utils/auth'

const FEEDBACK_KEY = 'conf_feedbacks'

function feedbackId(item: unknown): string | null {
  try {
    const obj = item && typeof item === 'object' ? item : JSON.parse(String(item))
    return obj?.id != null ? String(obj.id) : null
  } catch {
    return null
  }
}

// Authed uç: admin bir feedback'i id ile siler.
export default defineEventHandler(async (event) => {
  await assertAdmin(event)

  const id = getQuery(event).id
  if (id == null) {
    throw createError({ statusCode: 400, statusMessage: 'id is required' })
  }

  try {
    const items = await redis.lrange(FEEDBACK_KEY, 0, -1)
    // Redis'ten string ya da obje dönebilir; silmek için list'teki gerçek üyeyi bul.
    const target = (items || []).find(raw => feedbackId(raw) === String(id))
    if (target !== undefined) {
      const member = typeof target === 'string' ? target : JSON.stringify(target)
      await redis.lrem(FEEDBACK_KEY, 1, member)
    }
    return { success: true }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Feedback silinemedi' })
  }
})
