<!-- src/views/DashboardView.vue -->
<template>
  <div class="min-h-screen bg-gray-50/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading state -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="i in 4" :key="i" class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div class="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Quizuri"
          :value="stats.totalQuizzes"
          color="blue"
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        >
          {{ stats.publishedQuizzes }} publicate
        </StatsCard>

        <StatsCard
          title="Total Întrebări"
          :value="stats.totalQuestions"
          color="indigo"
          icon="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        >
          în {{ stats.totalQuizzes }} quizuri
        </StatsCard>

        <StatsCard
          title="Completări"
          :value="stats.totalCompletions"
          color="purple"
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        >
          în ultima lună
        </StatsCard>

        <StatsCard
          title="Rata de Completare"
          :value="`${stats.completionRate}%`"
          color="rose"
          icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        >
          din total accesări
        </StatsCard>
      </div>

      <!-- Recent Activity & Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activity -->
        <div class="[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-white
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-200 lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 max-h-96 overflow-y-scroll">
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Activitate Recentă</h2>
            <div v-if="recentActivity.length === 0" class="text-center py-8 text-gray-500">
              Nu există activitate recentă
            </div>
            <div v-else class="space-y-4">
              <ActivityItem
                v-for="activity in recentActivity"
                :key="activity.id"
                :type="activity.type"
                :title="activity.title"
                :time="activity.time"
                :action-link="getActivityLink(activity)"
              />
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Acțiuni Rapide</h2>
            <div class="space-y-3">
              <button 
                @click="$router.push('/my-quizzes')"
                class="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span class="text-sm font-medium text-gray-900">Quiz Nou</span>
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>

              <button 
                @click="$router.push('/questions')"
                class="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span class="text-sm font-medium text-gray-900">Adaugă Întrebări</span>
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              <button 
                @click="$router.push('/my-quizzes')"
                class="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span class="text-sm font-medium text-gray-900">Vezi Quizurile Mele</span>
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
import axios from 'axios'
import StatsCard from '@/components/StatsCard.vue'
import ActivityItem from '@/components/ActivityItem.vue'

const API_URL = 'http://localhost:3000/api'
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

const loadDashboardData = async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    console.log('Dashboard data received:', response.data)
    stats.value = response.data.stats
    recentActivity.value = response.data.recentActivity
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

const getActivityLink = (activity) => {
  if (activity.type === 'quiz-created' || activity.type === 'quiz-completed') {
    return `/quiz/${activity.details.quizId}`
  }
  return ''
}

onMounted(loadDashboardData)
</script>