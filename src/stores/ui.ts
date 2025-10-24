import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark'
const THEME_KEY = 'babystats:theme'

function applyDarkClass(isDark: boolean) {
  const el = document.documentElement
  el.classList.toggle('dark', isDark)
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    theme: 'light' as ThemeMode,
  }),
  getters: {
    isDark(state): boolean {
      return state.theme === 'dark'
    },
  },
  actions: {
    initTheme() {
      const saved = localStorage.getItem(THEME_KEY) as ThemeMode | null
      if (saved === 'light' || saved === 'dark') this.theme = saved
      this.applyTheme()
    },
    setTheme(mode: ThemeMode) {
      this.theme = mode
      localStorage.setItem(THEME_KEY, mode)
      this.applyTheme()
    },
    toggleTheme() {
      this.setTheme(this.isDark ? 'light' : 'dark')
    },
    applyTheme() {
      applyDarkClass(this.isDark)
    },
  },
})
