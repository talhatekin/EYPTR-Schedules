export const useConferenceData = () => {
  const days = useState<any[]>('conf_days', () => [])
  const sessions = useState<any[]>('conf_sessions', () => [])
  const announcements = useState<any[]>('conf_announcements', () => [])
  const feedbacks = useState<any[]>('conf_feedbacks', () => [])
  // YENİ: Daily Reminder için varsayılan state
  const dailyReminder = useState<any>('conf_daily_reminder', () => ({
    title: 'Daily Reminder',
    message: 'Please wear your delegate badges at all times inside the venue.',
    type: 'info', // 'info', 'warning', 'urgent'
    active: true
  }))
  const isLoading = useState('conf_loading', () => false)

  // Admin login token'ı (auth.post.ts'in döndürdüğü değer) yazma uçlarına eklenir.
  const authHeaders = (): Record<string, string> => {
    if (!import.meta.client) return {}
    const token = localStorage.getItem('eyp_secure_auth_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const refreshData = async () => {
    isLoading.value = true
    try {
      const data = await $fetch('/api/data')
      if (data) {
        days.value = data.days || []
        sessions.value = data.sessions || []
        announcements.value = data.announcements || []
        feedbacks.value = data.feedbacks || []
        // Veritabanında varsa al, yoksa varsayılanı tut
        if (data.dailyReminder) {
          dailyReminder.value = data.dailyReminder
        }
      }
    } catch (e) {
      console.error('Veriler çekilirken hata oluştu:', e)
    } finally {
      isLoading.value = false
    }
  }

  // Admin içeriğini kaydeder (günler, oturumlar, duyurular, hatırlatma).
  // Feedback'ler ayrı depoda tutulduğu için buradan gönderilmez.
  const saveAll = async () => {
    try {
      await $fetch('/api/data', {
        method: 'POST',
        headers: authHeaders(),
        body: {
          days: days.value,
          sessions: sessions.value,
          announcements: announcements.value,
          dailyReminder: dailyReminder.value
        }
      })
      await refreshData()
    } catch (e) {
      console.error('Kayıt başarısız:', e)
      throw e
    }
  }

  // Public: yeni feedback ekler (kimlik doğrulama gerektirmez).
  const submitFeedback = async (payload: { name?: string, category?: string, message: string }) => {
    await $fetch('/api/feedback', { method: 'POST', body: payload })
    await refreshData()
  }

  // Admin: bir feedback'i id ile siler.
  const removeFeedback = async (id: string | number) => {
    await $fetch('/api/feedback', {
      method: 'DELETE',
      headers: authHeaders(),
      query: { id }
    })
    await refreshData()
  }

  return { days, sessions, announcements, feedbacks, dailyReminder, isLoading, refreshData, saveAll, submitFeedback, removeFeedback }
}
