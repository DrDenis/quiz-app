<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-slate-900/50 relative">
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
    </div>

    <div class="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12  relative z-10">
      <!-- Profile Header -->
      <div
        class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex items-center gap-6">
          <!-- Avatar -->
          <div class="relative">
            <div
              class="w-24 h-24 rounded-2xl bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
              {{ userInitials }}
            </div>
          </div>

          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ userProfile.name }}</h1>
                <p class="text-gray-500 dark:text-gray-400">{{ user?.email }}</p>
              </div>
              <button v-if="!isEditing" @click="isEditing = true"
                class="px-4 py-2 bg-gradient-to-r from-primary to-blue-500 text-white rounded-lg hover:opacity-90 transition-colors">
                Editează Profil
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <div v-for="(stat, key) in stats" :key="key"
          class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center">
          <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {{ stat }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ statLabels[key] }}
          </div>
        </div>
      </div>

      <!-- Settings Form -->
      <div
        class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Setări Profil
          </h2>

          <div class="space-y-6">
            <!-- Display Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nume Display
              </label>
              <input v-model="userProfile.name" type="text" :disabled="!isEditing"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-slate-800" />
            </div>

            <!-- Email Preferences -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Notificări Email
              </label>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input type="checkbox" v-model="userProfile.emailPreferences.quizCompleted" :disabled="!isEditing"
                    class="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">
                    Când cineva completează un quiz
                  </span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="userProfile.emailPreferences.weeklyStats" :disabled="!isEditing"
                    class="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">
                    Statistici săptămânale
                  </span>
                </label>
              </div>
            </div>

            <!-- Theme -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Temă
              </label>
              <select v-model="userProfile.theme" :disabled="!isEditing"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-slate-800">
                <option value="system">Sistem</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 pt-4" v-if="isEditing">
              <button @click="cancelEdit"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                Anulează
              </button>
              <button @click="saveProfile"
                class="px-4 py-2 bg-gradient-to-r from-primary to-blue-500 text-white rounded-lg hover:opacity-90 transition-colors">
                Salvează Modificările
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios'
import { computed } from "vue";

const API_URL = 'http://localhost:3000/api'
const { getAccessTokenSilently, user } = useAuth0()

const isEditing = ref(false)
const stats = ref({
  totalQuizzes: 0,
  totalCompletions: 0,
  totalQuestions: 0
})

const userProfile = ref({
  name: '',
  emailPreferences: {
    quizCompleted: true,
    weeklyStats: false
  },
  theme: 'system'
})

// Compute user initials from name
const userInitials = computed(() => {
  const name = userProfile.value.name || ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const loadProfile = async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    userProfile.value = {
      ...userProfile.value,
      ...response.data
    }
    stats.value = response.data.stats
  } catch (error) {
    console.error('Error loading profile:', error)
  }
}

const saveProfile = async () => {
  try {
    const token = await getAccessTokenSilently()
    await axios.put(
      `${API_URL}/profile`,
      userProfile.value,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    isEditing.value = false
    alert('Profilul a fost actualizat cu succes!')
  } catch (error) {
    console.error('Error saving profile:', error)
    alert('Eroare la salvarea profilului')
  }
}

const cancelEdit = () => {
  isEditing.value = false
  loadProfile() // Reîncarcă datele originale
}

const statLabels = {
  totalQuizzes: 'Quizuri Create',
  totalCompletions: 'Completări',
  totalQuestions: 'Întrebări'
}

onMounted(() => {
  if (user.value) {
    userProfile.value.name = user.value.name
  }
  loadProfile()
})
</script>