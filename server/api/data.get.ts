import { redis } from '../utils/redis'

const CONTENT_KEY = 'conf_data'
const FEEDBACK_KEY = 'conf_feedbacks'

interface ConfData {
  days: any[]
  sessions: any[]
  announcements: any[]
  dailyReminder: Record<string, any> | null
  feedbacks: any[]
}

// Redis list elemanları string veya (otomatik parse edildiğinde) obje olabilir.
function parseFeedback(item: unknown) {
  if (item && typeof item === 'object') return item
  try {
    return JSON.parse(String(item))
  } catch {
    return null
  }
}

// İçerik + feedback deposunu birleştirip eski istemci şekliyle döndürür.
export default defineEventHandler(async (): Promise<ConfData> => {
  try {
    const [content, rawFeedbacks] = await Promise.all([
      redis.get<any>(CONTENT_KEY),
      redis.lrange(FEEDBACK_KEY, 0, -1)
    ])
    const base = content || {}
    const feedbacks = (rawFeedbacks || []).map(parseFeedback).filter(Boolean)
    return {
      days: base.days || [],
      sessions: base.sessions || [],
      announcements: base.announcements || [],
      dailyReminder: base.dailyReminder ?? null,
      feedbacks
    }
  } catch (error) {
    return { days: [], sessions: [], announcements: [], dailyReminder: null, feedbacks: [] }
  }
})
