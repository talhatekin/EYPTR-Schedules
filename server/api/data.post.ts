import { redis } from '../utils/redis'
import { assertAdmin } from '../utils/auth'

const CONTENT_KEY = 'conf_data'

// Yazma yalnızca geçerli admin token'ıyla mümkün. Sadece admin'in yönettiği
// içerik kaydedilir; feedback deposuna (conf_feedbacks) dokunulmaz.
export default defineEventHandler(async (event) => {
  await assertAdmin(event)
  try {
    const body = await readBody(event)
    const content = {
      days: body?.days ?? [],
      sessions: body?.sessions ?? [],
      announcements: body?.announcements ?? [],
      dailyReminder: body?.dailyReminder ?? null
    }
    await redis.set(CONTENT_KEY, content)
    return { success: true }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Veritabanına yazılamadı' })
  }
})
