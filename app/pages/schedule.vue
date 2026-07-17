<template>
  <div class="space-y-6">
    <!-- Başlık ve Saat -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Conference Schedule</h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Sessions, workshops, and timings by day.</p>
      </div>

      <!-- Gerçek Zamanlı Saat -->
      <div class="flex items-center gap-2 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 px-3.5 py-2 rounded-xl self-start sm:self-auto">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-sm font-semibold text-slate-700 dark:text-slate-200 tabular-nums">Local time {{ currentTime }}</span>
      </div>
    </div>

    <!-- ROL SEÇİM ANAHTARI -->
    <div class="bg-slate-100 dark:bg-white/[0.06] p-1.5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center gap-1.5 w-full sm:w-auto sm:inline-flex">
      <button
        v-for="role in roles"
        :key="role.value"
        :class="[
          'flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2',
          selectedRole === role.value
            ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-white/20'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        ]"
        @click="selectedRole = role.value"
      >
        <AppIcon :name="role.icon" :size="17" />
        <span>{{ role.label }}</span>
      </button>
    </div>

    <!-- Gün Butonları -->
    <div v-if="sortedDays && sortedDays.length > 0" class="flex flex-wrap gap-2">
      <button
        v-for="day in sortedDays"
        :key="day.id"
        :class="[
          'px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2.5 border',
          selectedDayId === day.id
            ? 'bg-slate-900 text-white dark:bg-white/15 dark:text-white border-slate-900 dark:border-white/25'
            : 'bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/25'
        ]"
        @click="selectedDayId = day.id"
      >
        <span>{{ day.label }}</span>
        <span :class="[
          'flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-semibold',
          selectedDayId === day.id ? 'bg-white/15 text-white dark:bg-black/25' : 'bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300'
        ]">
          <AppIcon name="calendar" :size="12" />
          {{ day.date }}
        </span>
      </button>
    </div>

    <!-- Seçili Günün Başlığı -->
    <div v-if="selectedDayObj" class="bg-slate-900 dark:bg-white/[0.06] p-4 sm:p-5 rounded-2xl border border-slate-900 dark:border-white/10 flex items-center justify-between gap-3 text-white">
      <div class="flex items-center gap-3.5 min-w-0">
        <div class="w-11 h-11 rounded-xl bg-white/10 dark:bg-white/10 flex items-center justify-center shrink-0">
          <AppIcon :name="selectedRole === 'delegates' ? 'user' : 'briefcase'" :size="22" />
        </div>
        <div class="min-w-0">
          <h2 class="font-semibold text-base sm:text-lg leading-tight truncate">{{ selectedDayObj.label }}</h2>
          <p class="text-sm text-slate-300 dark:text-slate-400">Timings for {{ selectedRole === 'delegates' ? 'delegates' : 'officials' }}</p>
        </div>
      </div>
      <div class="flex items-center gap-1.5 bg-white/10 text-slate-100 font-semibold text-sm px-3.5 py-2 rounded-xl shrink-0">
        <AppIcon name="calendar" :size="15" />
        <span class="hidden xs:inline sm:inline">{{ selectedDayObj.date }}</span>
      </div>
    </div>

    <!-- Oturumlar -->
    <div v-if="sortedDays && sortedDays.length > 0 && currentDaySessions.length > 0" class="space-y-3">
      <div
        v-for="session in currentDaySessions"
        :key="session.id"
        :class="[
          'p-4 sm:p-5 rounded-2xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3',
          isSessionLive(session)
            ? 'bg-rose-50 dark:bg-rose-500/[0.08] border-rose-300 dark:border-rose-500/40 shadow-sm shadow-rose-500/10'
            : 'bg-white dark:bg-white/[0.04] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
        ]"
      >
        <div class="flex items-start gap-3.5 min-w-0">
          <!-- Saat Badge -->
          <div :class="[
            'font-semibold text-sm px-3 py-2 rounded-xl shrink-0 tabular-nums text-center min-w-[4.5rem]',
            isSessionLive(session)
              ? 'bg-rose-500 text-white'
              : 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white'
          ]">
            {{ session.time }}
          </div>

          <div class="space-y-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span v-if="isSessionLive(session)" class="inline-flex items-center gap-1 bg-rose-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide">
                <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                Live now
              </span>
              <h3 class="font-semibold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">{{ session.title }}</h3>
            </div>
            <p v-if="session.speaker" class="text-sm text-slate-600 dark:text-slate-300">{{ session.speaker }}</p>
          </div>
        </div>

        <div v-if="session.location" class="flex items-center gap-1.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-xl self-start sm:self-center shrink-0 text-slate-700 dark:text-slate-200">
          <AppIcon name="map-pin" :size="15" class="text-slate-400 dark:text-slate-500" />
          <span class="text-sm font-medium">{{ session.location }}</span>
        </div>
      </div>
    </div>

    <!-- Hiç Oturum Yoksa -->
    <div v-else class="text-center py-16 px-6 bg-white dark:bg-white/[0.03] rounded-2xl border border-dashed border-slate-300 dark:border-white/10 space-y-3">
      <div class="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-slate-400 dark:text-slate-500">
        <AppIcon :name="selectedRole === 'delegates' ? 'user' : 'briefcase'" :size="24" />
      </div>
      <h3 class="font-semibold text-slate-800 dark:text-slate-200 text-base">No schedule published yet</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        There are no sessions listed for {{ selectedRole === 'delegates' ? 'delegates' : 'officials' }} right now. Please check back shortly.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useConferenceData } from '../composables/useConferenceData'

const { days, sessions } = useConferenceData()
const selectedDayId = ref(null)
const selectedRole = ref('delegates') // Başlangıçta delegeler seçili
const currentTime = ref('')
const nowTimestamp = ref(Date.now()) // Reaktif zaman tetikleyicisi
let timer = null

const roles = [
  { value: 'delegates', label: 'Delegates', icon: 'user' },
  { value: 'officials', label: 'Officials', icon: 'briefcase' }
]

const updateClock = () => {
  nowTimestamp.value = Date.now()
  currentTime.value = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function parseDateStr(dateStr) {
  if (!dateStr) return 0
  let cleaned = String(dateStr).toLowerCase().trim()
  const turkishMonths = { 'ocak':'january','şubat':'february','mart':'march','nisan':'april','mayıs':'may','haziran':'june','temmuz':'july','ağustos':'august','eylül':'september','ekim':'october','kasım':'november','aralık':'december' }
  for (const [tr, en] of Object.entries(turkishMonths)) { cleaned = cleaned.replace(tr, en) }
  // Yıl ekli değilse otomatik ekle ki NaN hatası vermesin
  if (!cleaned.includes('2026')) cleaned += ' 2026'
  return new Date(cleaned).getTime() || 0
}

function parseTimeToMinutes(tStr) {
  if (!tStr) return 0
  let firstPart = String(tStr).split('-')[0].trim().replace(/\./g, ':').replace(/\s/g, '')
  if (firstPart.includes(':')) {
    const [h, m] = firstPart.split(':').map(Number)
    return (h || 0) * 60 + (m || 0)
  }
  return Number(firstPart) * 60 || 0
}

// === OTURUM ŞU AN CANLI MI KONTROL MOTORU ===
const isSessionLive = (session) => {
  if (!session.time || !selectedDayObj.value) return false

  const now = new Date(nowTimestamp.value)

  const dayTimestamp = parseDateStr(selectedDayObj.value.date)
  if (!dayTimestamp) return false
  const dayDate = new Date(dayTimestamp)

  const isSameDay = now.getMonth() === dayDate.getMonth() && now.getDate() === dayDate.getDate()
  if (!isSameDay) return false

  const parts = String(session.time).split('-').map(p => p.trim().replace(/\./g, ':'))
  if (parts.length < 2) return false

  const parseToMins = (t) => {
    const [h, m] = t.split(':').map(Number)
    return (h || 0) * 60 + (m || 0)
  }

  const startMins = parseToMins(parts[0])
  const endMins = parseToMins(parts[1])
  const nowMins = now.getHours() * 60 + now.getMinutes()

  return nowMins >= startMins && nowMins < endMins
}

// SADECE SEÇİLİ ROLE AİT GÜNLERİ GETİR
const sortedDays = computed(() => {
  if (!days.value) return []
  return [...days.value]
    .filter(d => (d.role || 'delegates') === selectedRole.value)
    .sort((a, b) => parseDateStr(a.date) - parseDateStr(b.date))
})

const selectedDayObj = computed(() => {
  return sortedDays.value.find(d => d.id === selectedDayId.value) || null
})

// SADECE SEÇİLİ GÜNE VE ROLE AİT OTURUMLARI GETİR
const currentDaySessions = computed(() => {
  if (!sessions.value || !selectedDayId.value) return []
  return [...sessions.value]
    .filter(s => s.dayId === selectedDayId.value && (s.role || 'delegates') === selectedRole.value)
    .sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time))
})

// Rol (Delegates / Officials) değiştiğinde o rolün ilk gününü otomatik seç
watch(selectedRole, () => {
  if (sortedDays.value.length > 0) {
    selectedDayId.value = sortedDays.value[0].id
  } else {
    selectedDayId.value = null
  }
})

// Günler veritabanından yüklendiğinde ilk günü seç
watch(sortedDays, (newVal) => {
  if (newVal.length > 0 && (!selectedDayId.value || !newVal.find(d => d.id === selectedDayId.value))) {
    selectedDayId.value = newVal[0].id
  }
}, { immediate: true })

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 10000) // 10 saniyede bir saati ve canlı durumunu güncelle
  if (sortedDays.value.length > 0 && !selectedDayId.value) {
    selectedDayId.value = sortedDays.value[0].id
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
