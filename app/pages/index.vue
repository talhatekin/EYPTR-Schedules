<template>
  <div class="space-y-8">
    <!-- DİNAMİK DAILY REMINDER BANNER -->
    <div
      v-if="dailyReminder && dailyReminder.active"
      :class="[
        'p-5 sm:p-6 rounded-2xl border flex items-start gap-4',
        reminderStyle.container
      ]"
    >
      <div :class="['w-11 h-11 rounded-xl flex items-center justify-center shrink-0', reminderStyle.badge]">
        <AppIcon :name="reminderStyle.icon" :size="22" />
      </div>
      <div class="space-y-1.5 flex-1 min-w-0">
        <div class="flex items-center justify-between gap-3">
          <h3 class="font-semibold text-base tracking-tight">{{ dailyReminder.title || 'Daily Reminder' }}</h3>
          <span :class="['text-[11px] font-semibold px-2.5 py-0.5 rounded-md uppercase tracking-wide', reminderStyle.tag]">
            {{ dailyReminder.type || 'info' }}
          </span>
        </div>
        <p class="text-sm leading-relaxed opacity-90">{{ dailyReminder.message }}</p>
      </div>
    </div>

    <!-- ANNOUNCEMENTS SECTION -->
    <section class="space-y-4">
      <div class="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
        <div class="flex items-center gap-2.5">
          <AppIcon name="megaphone" :size="20" class="text-slate-500 dark:text-slate-400" />
          <h2 class="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Live Feed &amp; Announcements</h2>
          <span class="bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold px-2 py-0.5 rounded-md">
            {{ announcements.length }}
          </span>
        </div>
        <span class="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Real-time updates
        </span>
      </div>

      <!-- Duyuru Listesi -->
      <div v-if="announcements && announcements.length > 0" class="grid gap-3">
        <article
          v-for="(item, idx) in announcements"
          :key="idx"
          class="bg-white dark:bg-white/[0.04] p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-colors space-y-2.5"
        >
          <div class="flex items-center justify-between gap-3">
            <span :class="[
              'text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wide border',
              isUrgent(item.category)
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                : 'bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300 border-slate-200 dark:border-white/10'
            ]">
              {{ item.category || 'General Notice' }}
            </span>
          </div>
          <h3 class="font-semibold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">{{ item.title }}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ item.desc }}</p>
        </article>
      </div>

      <div v-else class="text-center py-16 px-6 bg-white dark:bg-white/[0.03] rounded-2xl border border-dashed border-slate-300 dark:border-white/10 space-y-3">
        <div class="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-slate-400 dark:text-slate-500">
          <AppIcon name="inbox" :size="24" />
        </div>
        <h4 class="font-semibold text-slate-800 dark:text-slate-200 text-sm">No announcements yet</h4>
        <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Check back later for news and live updates from the organizing team.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { announcements, dailyReminder } = useConferenceData()

const isUrgent = (category) => {
  const c = String(category || '').toLowerCase()
  return c.includes('urgent') || c.includes('acil')
}

const REMINDER_STYLES = {
  urgent: {
    icon: 'alert-octagon',
    container: 'bg-rose-50 dark:bg-rose-500/[0.08] border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-200',
    badge: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300',
    tag: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200'
  },
  warning: {
    icon: 'alert-triangle',
    container: 'bg-amber-50 dark:bg-amber-500/[0.08] border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-200',
    badge: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
    tag: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200'
  },
  info: {
    icon: 'info',
    container: 'bg-slate-100 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200',
    badge: 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300',
    tag: 'bg-white text-slate-600 dark:bg-white/10 dark:text-slate-300 border border-slate-200 dark:border-white/10'
  }
}

const reminderStyle = computed(() => REMINDER_STYLES[dailyReminder.value?.type] || REMINDER_STYLES.info)
</script>
