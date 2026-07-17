import { redis } from '../utils/redis'

const FEEDBACK_KEY = 'conf_feedbacks'

// Public uç: delege feedback'i ekler. Kimlik doğrulama gerektirmez.
// lpush atomik olduğu için eşzamanlı gönderimlerde veri kaybı olmaz.
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const message = String(body?.message || '').trim()

  if (!message) {
    throw createError({ statusCode: 400, statusMessage: 'Message is required' })
  }

  const feedback = {
    id: Date.now(),
    name: String(body?.name || '').trim() || 'Anonymous Delegate',
    category: String(body?.category || 'General'),
    message,
    date: new Date().toLocaleDateString('tr-TR')
  }

  try {
    await redis.lpush(FEEDBACK_KEY, JSON.stringify(feedback))
    return { success: true, feedback }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Feedback kaydedilemedi' })
  }
})
