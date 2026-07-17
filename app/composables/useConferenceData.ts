import { ref } from 'vue'

export const useConferenceData = () => {
  const days = useState('conf_days', () => [])
  const sessions = useState('conf_sessions', () => [])
  const announcements = useState('conf_announcements', () => [])
  const feedbacks = useState('conf_feedbacks', () => [])
  // YENİ: Daily Reminder için varsayılan state
  const dailyReminder = useState('conf_daily_reminder', () => ({
    title: 'Daily Reminder',
    message: 'Please wear your delegate badges at all times inside the venue.',
    type: 'info', // 'info', 'warning', 'urgent'
    active: true
  }))
  const isLoading = useState('conf_loading', () => false)

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

  const saveAll = async () => {
    try {
      await $fetch('/api/data', {
        method: 'POST',
        body: {
          days: days.value,
          sessions: sessions.value,
          announcements: announcements.value,
          feedbacks: feedbacks.value,
          dailyReminder: dailyReminder.value // YENİ: Buluta kaydediliyor!
        }
      })
      await refreshData()
    } catch (e) {
      console.error('Kayıt başarısız:', e)
      alert('Bulut veritabanına kaydedilemedi! Lütfen testi canlı Vercel linkinden yaptığından emin ol.')
    }
  }

  return { days, sessions, announcements, feedbacks, dailyReminder, isLoading, refreshData, saveAll }
}