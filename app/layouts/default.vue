<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased transition-colors duration-300">
    <!-- Navbar Header -->
    <header class="bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200 dark:border-white/10 sticky top-0 z-40 transition-colors">
      <div class="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-3">

        <!-- SOL TARAF: LOGOLAR -->
        <div class="flex items-center gap-3 sm:gap-4 min-w-0">
          <div class="flex items-center shrink-0">
            <img src="/eyp-logo-light.png" alt="EYP Türkiye" class="h-7 sm:h-9 object-contain dark:hidden" >
            <img src="/eyp-logo-dark.png" alt="EYP Türkiye" class="h-7 sm:h-9 object-contain hidden dark:block" >
          </div>

          <div class="h-6 sm:h-8 w-px bg-slate-200 dark:bg-white/10 shrink-0"></div>

          <NuxtLink to="/" class="flex items-center gap-2.5 group min-w-0">
            <div class="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden rounded-xl bg-transparent dark:bg-white/[0.06] border border-transparent dark:border-white/10 shrink-0">
              <img src="/logo-light.png" alt="" class="w-full h-full object-contain dark:hidden" >
              <img src="/logo-dark.png" alt="" class="w-full h-full object-contain hidden dark:block" >
            </div>
            <span class="hidden sm:block font-bold text-lg tracking-tight text-slate-900 dark:text-white truncate">
              Istanbul NS 26
            </span>
          </NuxtLink>
        </div>

        <!-- SAĞ TARAF: MASAÜSTÜ MENÜ -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <nav class="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-white/[0.06] p-1 rounded-xl border border-slate-200/70 dark:border-white/10">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              active-class="!bg-white !text-slate-900 dark:!bg-white/10 dark:!text-white shadow-sm !font-semibold"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>

          <button
            class="p-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center border border-transparent dark:border-white/10"
            :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
            :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleTheme"
          >
            <AppIcon :name="isDarkMode ? 'sun' : 'moon'" :size="18" />
          </button>
        </div>
      </div>

      <!-- MOBİL NAVİGASYON -->
      <div class="md:hidden border-t border-slate-200 dark:border-white/10 px-4 py-2 bg-white/70 dark:bg-white/[0.02] backdrop-blur-md">
        <nav class="flex items-center gap-1.5">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="flex-1 text-center py-2 rounded-lg text-sm font-medium transition-colors text-slate-600 dark:text-slate-300"
            active-class="!bg-slate-900 !text-white dark:!bg-white/10 dark:!text-white shadow-sm !font-semibold dark:border dark:border-white/20"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <NuxtPage />
    </main>

    <footer class="max-w-5xl mx-auto px-4 py-8 border-t border-slate-200 dark:border-white/10 text-center text-sm text-slate-500 dark:text-slate-400">
      Istanbul 2026 &middot; 5th National Session of EYP Türkiye
    </footer>
  </div>
</template>

<script setup>
const { isDarkMode, toggleTheme } = useTheme()

const navLinks = [
  { to: '/', label: 'Feed' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/feedback', label: 'Feedback' }
]
</script>
