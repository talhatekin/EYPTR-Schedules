import { kv } from '@vercel/kv'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'POST') {
    try {
      const body = await readBody(event)
      await kv.set('conf_data', body)
      return { success: true }
    } catch (error) {
      throw createError({ statusCode: 500, statusMessage: 'Veritabanına yazılamadı' })
    }
  } else {
    try {
      const data = await kv.get('conf_data')
      return data || { days: [], sessions: [], announcements: [], feedbacks: [] }
    } catch (error) {
      return { days: [], sessions: [], announcements: [], feedbacks: [] }
    }
  }
})