<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm p-6 border border-gray-100 dark:border-dark-border">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Quizuri</h3>
            <span class="p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
              <svg class="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
          </div>
          <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ stats.totalQuizzes }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {{ stats.publishedQuizzes }} publicate
          </p>
        </div>

        <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm p-6 border border-gray-100 dark:border-dark-border">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Completări</h3>
            <span class="p-2 bg-green-50 dark:bg-green-900/50 rounded-lg">
              <svg class="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ stats.totalCompletions }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">în ultima lună</p>
        </div>

        <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm p-6 border border-gray-100 dark:border-dark-border">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Întrebări</h3>
            <span class="p-2 bg-purple-50 dark:bg-purple-900/50 rounded-lg">
              <svg class="w-5 h-5 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </span>
          </div>
          <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ stats.totalQuestions }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">în bancă</p>
        </div>

        <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm p-6 border border-gray-100 dark:border-dark-border">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Rata Completare</h3>
            <span class="p-2 bg-rose-50 dark:bg-rose-900/50 rounded-lg">
              <svg class="w-5 h-5 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </span>
          </div>
          <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ stats.completionRate }}%</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">din total accesări</p>
        </div>
      </div>

      <!-- Recent Activity & Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activity -->
        <div
          class="lg:col-span-2 bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Activitate Recentă</h2>
            <div class="max-h-[32rem] overflow-y-auto pr-2 -mr-2">
              <div v-if="recentActivity.length === 0" class="text-center py-8">
                <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-gray-500 dark:text-gray-400">Nu există activitate recentă</p>
              </div>
              <div v-else class="space-y-4">
                <div v-for="activity in recentActivity" :key="activity.id"
                  class="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span class="w-10 h-10 flex items-center justify-center rounded-lg"
                    :class="getActivityColor(activity.type)">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        :d="getActivityIcon(activity.type)" />
                    </svg>
                  </span>
                  <div class="ml-4 flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ activity.title }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ activity.time }}</p>
                  </div>
                  <button v-if="activity.details.quizId" @click="$router.push(`/quiz/${activity.details.quizId}`)"
                    class="text-primary hover:text-primary/90 text-sm font-medium">
                    Vezi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Acțiuni Rapide</h2>
            <div class="space-y-3">
              <button @click="$router.push('/my-quizzes')"
                class="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors group">
                <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Quiz Nou</span>
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>

              <button @click="$router.push('/questions/bank')"
                class="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors group">
                <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Bancă Întrebări</span>
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </button>

              <button @click="$router.push('/profile')"
                class="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors group">
                <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Profil</span>
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
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
//import { useRouter } from 'vue-router'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api'
// Putem elimina router dacă îl folosim direct în template cu $router
// const router = useRouter()
const { getAccessTokenSilently } = useAuth0()

const stats = ref({
  totalQuizzes: 0,
  publishedQuizzes: 0,
  totalQuestions: 0,
  totalCompletions: 0,
  completionRate: 0
})

const recentActivity = ref([])
const isLoading = ref(true)

const getActivityColor = (type) => {
  const colors = {
    'quiz-created': 'bg-blue-50 dark:bg-blue-900/50 text-blue-500 dark:text-blue-400',
    'quiz-completed': 'bg-green-50 dark:bg-green-900/50 text-green-500 dark:text-green-400',
    'question-added': 'bg-purple-50 dark:bg-purple-900/50 text-purple-500 dark:text-purple-400'
  }
  return colors[type] || 'bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400'
}

const getActivityIcon = (type) => {
  const icons = {
    'quiz-created': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    'quiz-completed': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    'question-added': 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  return icons[type] || ''
}

const loadDashboardData = async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    stats.value = response.data.stats
    recentActivity.value = response.data.recentActivity
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>