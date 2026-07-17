<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useConferenceData } from './composables/useConferenceData'

// SOSYAL MEDYA VE SEO AYARLARI
useSeoMeta({
  title: 'CONF 2026 | 5th National Session of EYP Türkiye',
  ogTitle: 'CONF 2026 | 5th National Session of EYP Türkiye',
  description: 'Welcome to the official digital dashboard for Istanbul 2026. Live feed, dynamic schedule, and delegate services.',
  ogDescription: 'Explore live schedules, announcements, and delegate services for the Istanbul 2026 National Session.',
  ogImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  twitterCard: 'summary_large_image'
})

const { refreshData } = useConferenceData()

// SSR Kilidi (F5 hafıza kaybını önler)
await useAsyncData('conference_data_init', async () => {
  await refreshData()
  return true
})
</script>