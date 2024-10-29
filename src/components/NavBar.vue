<template>
  <nav
    class="sticky top-0 z-40 w-full transition-colors duration-500 lg:z-50 backdrop-blur-md bg-white/70 supports-backdrop-blur:bg-white/60 dark:bg-slate-900/70 border-b border-slate-900/10 dark:border-slate-50/[0.06]">
    <div class="relative">
      <!-- Background shapes -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl"></div>
        <div class="absolute right-0 top-0 w-32 h-32 rounded-full bg-blue-500/20 blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="flex justify-between align-middle h-20">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/"
              class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              Quiz App
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <button @click="isMenuOpen = !isMenuOpen"
            class="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle menu">
            <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="hidden lg:flex items-center gap-6">
            <!-- Navigation Links -->
            <transition name="fade" mode="out-in">
              <div v-if="isLoading" class="flex items-center gap-4">
                <div class="h-8 w-24 bg-gray-200 dark:bg-dark-card animate-pulse rounded-lg"></div>
                <div class="h-8 w-20 bg-gray-200 dark:bg-dark-card animate-pulse rounded-lg"></div>
                <div class="h-8 w-20 bg-gray-200 dark:bg-dark-card animate-pulse rounded-lg"></div>
              </div>
              <div v-else-if="isAuthenticated" class="flex gap-6">
                <router-link v-for="link in navLinks" :key="link.path" :to="link.path" class="nav-link relative group"
                  :class="{ 'text-primary': $route.path.startsWith(link.path) }">
                  <span class="relative z-10">{{ link.name }}</span>
                  <div
                    class="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform">
                  </div>
                </router-link>
              </div>
            </transition>

            <!-- User Menu -->
            <div v-if="isAuthenticated" class="relative" @keydown.escape="isDropdownOpen = false"
              @keydown.tab="handleTabNavigation">
              <button @click="isDropdownOpen = !isDropdownOpen"
                class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-haspopup="true" :aria-expanded="isDropdownOpen">
                <span class="text-sm">
                  <span class="font-medium text-gray-900 dark:text-gray-100">{{ user.given_name }}</span>
                </span>
                <svg xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-180': isDropdownOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <transition enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-100 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <div v-if="isDropdownOpen"
                  class="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700">
                  <router-link to="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    @click="isDropdownOpen = false">
                    Contul meu
                  </router-link>
                  <button @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                    Logout
                  </button>
                </div>
              </transition>
            </div>

            <!-- Login Button -->
            <button v-else-if="!isLoading" @click="handleLogin"
              class="px-6 py-2 bg-gradient-to-r from-primary to-blue-500 text-white rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-200"
              :disabled="isLoggingIn">
              <span v-if="isLoggingIn" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                    fill="none" />
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </span>
              <span v-else>Login</span>
            </button>

            <!-- Theme Toggle -->
            <button @click="toggleTheme"
              class="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle theme">
              <transition name="rotate" mode="out-in">
                <svg v-if="isDark" key="sun" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else key="moon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </transition>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-100 ease-in" leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0">
        <div v-if="isMenuOpen"
          class="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-800 shadow-lg border-t border-gray-100 dark:border-slate-700">
          <div class="px-4 py-6 space-y-4">
            <template v-if="isAuthenticated">
              <router-link v-for="link in navLinks" :key="link.path" :to="link.path"
                class="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                :class="{ 'text-primary': $route.path.startsWith(link.path) }" @click="isMenuOpen = false">
                {{ link.name }}
              </router-link>
              <div class="pt-4 border-t border-gray-100 dark:border-slate-700">
                <router-link to="/profile"
                  class="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                  @click="isMenuOpen = false">
                  Contul meu
                </router-link>
                <button @click="handleLogout"
                  class="w-full text-left py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors">
                  Logout
                </button>
              </div>
            </template>
            <button v-else @click="handleLogin"
              class="w-full py-2 bg-gradient-to-r from-primary to-blue-500 text-white rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-200">
              Login
            </button>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useAuth0 } from '@auth0/auth0-vue'
import { useAuthStore } from '@/stores/auth'
import { onClickOutside, onKeyStroke } from '@vueuse/core'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const isDark = computed(() => themeStore.isDark)

const {
  loginWithRedirect,
  logout,
  user,
  isAuthenticated,
  isLoading
} = useAuth0()

const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const isLoggingIn = ref(false)

const navLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Întrebări', path: '/questions/bank' },
  { name: 'Quizuri', path: '/my-quizzes' }
]

const toggleTheme = () => {
  themeStore.setTheme(isDark.value ? 'light' : 'dark')
}

const handleLogin = async () => {
  isLoggingIn.value = true
  try {
    await loginWithRedirect({
      appState: { targetUrl: '/dashboard' }
    })
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    isLoggingIn.value = false
  }
}

const handleLogout = () => {
  authStore.clearAuth()
  isDropdownOpen.value = false
  isMenuOpen.value = false
  logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  })
}

const handleTabNavigation = (event) => {
  const dropdown = document.querySelector('.dropdown-menu')
  const focusableElements = dropdown?.querySelectorAll(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  if (!focusableElements?.length) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && document.activeElement === firstElement) {
    lastElement.focus()
    event.preventDefault()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    firstElement.focus()
    event.preventDefault()
  }
}

// Close dropdown when clicking outside
onClickOutside(document.querySelector('.dropdown-menu'), () => {
  isDropdownOpen.value = false
})

// Close menus on escape key
onKeyStroke('Escape', () => {
  isDropdownOpen.value = false
  isMenuOpen.value = false
})
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors;
}

.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.3s ease;
}

.rotate-enter-from,
.rotate-leave-to {
  opacity: 0;
  transform: rotate(180deg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>