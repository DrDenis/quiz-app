<template>
  <div class="min-h-screen bg-gray-50/50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Profile Header Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div class="flex items-center gap-6">
          <div class="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center">
            <span class="text-3xl font-bold text-primary">
              {{ userInitials }}
            </span>
          </div>

          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ userProfile.name }}</h1>
                <p class="text-gray-500">{{ user?.email }}</p>
              </div>
              <button @click="isEditing = true" class="text-primary hover:text-primary/90 font-medium"
                v-if="!isEditing">
                Editează Profil
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Profile Stats -->
      <div class="grid grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="text-sm font-medium text-gray-500 mb-1">Quizuri Create</div>
          <div class="text-2xl font-semibold text-gray-900">{{ stats.totalQuizzes }}</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="text-sm font-medium text-gray-500 mb-1">Completări Total</div>
          <div class="text-2xl font-semibold text-gray-900">{{ stats.totalCompletions }}</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="text-sm font-medium text-gray-500 mb-1">Întrebări Create</div>
          <div class="text-2xl font-semibold text-gray-900">{{ stats.totalQuestions }}</div>
        </div>
      </div>



      <!-- Profile Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-6">Setări Profil</h2>

          <div class="space-y-6">
            <!-- Username -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nume Display
              </label>
              <input v-model="userProfile.name" type="text" :disabled="!isEditing"
                class="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary disabled:bg-gray-50" />
            </div>

            <!-- Email Notifications -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Notificări Email
              </label>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input type="checkbox" v-model="userProfile.emailPreferences.quizCompleted" :disabled="!isEditing"
                    class="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="ml-2 text-gray-700">Când cineva completează un quiz</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="userProfile.emailPreferences.weeklyStats" :disabled="!isEditing"
                    class="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="ml-2 text-gray-700">Statistici săptămânale</span>
                </label>
              </div>
            </div>


            <!-- Theme Preference -->
            <div class="flex justify-end gap-3 pt-4" v-if="isEditing">
              <button @click="cancelEdit"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Anulează
              </button>
              <button @click="saveProfile"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Salvează Modificările
              </button>
            </div>>
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

onMounted(() => {
  if (user.value) {
    userProfile.value.name = user.value.name
  }
  loadProfile()
})
</script>