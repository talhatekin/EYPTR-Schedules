<template>
  <div class="max-w-xl mx-auto space-y-6">
    <!-- Başlık -->
    <div class="text-center space-y-3 border-b border-slate-200 dark:border-white/10 pb-6">
      <div class="w-12 h-12 bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 rounded-2xl flex items-center justify-center mx-auto border border-slate-200 dark:border-white/10">
        <AppIcon name="message-square" :size="24" />
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Delegate Feedback</h1>
      <p class="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
        Your questions, suggestions, or concerns go directly to the organizing committee.
      </p>
    </div>

    <!-- Başarı Mesajı -->
    <div
      v-if="status === 'success'"
      class="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/[0.08] border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200"
    >
      <AppIcon name="calendar_check" :size="20" class="mt-0.5 text-emerald-600 dark:text-emerald-400" />
      <p class="text-sm font-medium">Thank you. Your feedback has been received by the organizing team.</p>
    </div>
    <div
      v-else-if="status === 'error'"
      class="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/[0.08] border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-200"
    >
      <AppIcon name="alert-triangle" :size="20" class="mt-0.5 text-rose-600 dark:text-rose-400" />
      <p class="text-sm font-medium">Could not send your feedback. Please try again.</p>
    </div>

    <!-- Geri Bildirim Formu -->
    <form class="bg-white dark:bg-white/[0.04] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/10 space-y-5" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="fb-name" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Your name <span class="text-slate-400 dark:text-slate-500 font-normal">(optional)</span></label>
          <input id="fb-name" v-model="form.name" type="text" placeholder="e.g. Anonymous Delegate" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/20 focus:border-slate-500 dark:focus:border-white/30 transition" >
        </div>
        <div class="space-y-1.5">
          <label for="fb-category" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
          <select id="fb-category" v-model="form.category" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/20 focus:border-slate-500 dark:focus:border-white/30 transition">
            <option value="General">General Question</option>
            <option value="Logistics">Logistics &amp; Venue</option>
            <option value="Academics">Academic &amp; Committee</option>
            <option value="Urgent">Urgent Assistance</option>
          </select>
        </div>
      </div>

      <div class="space-y-1.5">
        <label for="fb-message" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Your message</label>
        <textarea id="fb-message" v-model="form.message" rows="4" required placeholder="Write your feedback or question clearly..." class="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-300 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/20 focus:border-slate-500 dark:focus:border-white/30 transition resize-y"></textarea>
      </div>

      <button type="submit" :disabled="isSubmitting || !form.message.trim()" class="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        <AppIcon name="send" :size="17" />
        <span>{{ isSubmitting ? 'Sending…' : 'Submit feedback' }}</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useConferenceData } from '../composables/useConferenceData'

const { submitFeedback } = useConferenceData()
const isSubmitting = ref(false)
const status = ref(null) // null | 'success' | 'error'

const form = reactive({
  name: '',
  category: 'General',
  message: ''
})

const handleSubmit = async () => {
  if (!form.message.trim()) return
  isSubmitting.value = true
  status.value = null
  try {
    await submitFeedback({
      name: form.name,
      category: form.category,
      message: form.message
    })
    status.value = 'success'
    form.name = ''
    form.category = 'General'
    form.message = ''
  } catch (e) {
    status.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script>
