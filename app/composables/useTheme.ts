// app/composables/useTheme.ts
import { ref, onMounted } from 'vue'

export const useTheme = () => {
  const isDarkMode = useState('is_dark_mode', () => false)

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    updateHTMLClass()
  }

  const updateHTMLClass = () => {
    if (import.meta.server) return

    const htmlElement = document.documentElement
    if (isDarkMode.value) {
      htmlElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      htmlElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Sayfa ilk yüklendiğinde kullanıcının eski tercihini veya sistem ayarını kontrol eder
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      isDarkMode.value = true
    } else {
      isDarkMode.value = false
    }
    updateHTMLClass()
  })

  return {
    isDarkMode,
    toggleTheme
  }
}