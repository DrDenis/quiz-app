<template>
  <div class="min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">
          Quizurile Mele
        </h1>
        <button
          @click="openNewQuizModal"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Quiz Nou
        </button>
      </div>

      <!-- Lista de quizuri -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="quiz in quizzes" 
          :key="quiz._id"
          class="bg-white shadow rounded-lg overflow-hidden"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-lg font-medium text-gray-900">{{ quiz.title }}</h2>
              <span 
                :class="quiz.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                class="px-2 py-1 text-xs rounded-full"
              >
                {{ quiz.isPublished ? 'Publicat' : 'Ciornă' }}
              </span>
            </div>
            
            <p class="text-gray-600 text-sm mb-4">{{ quiz.description }}</p>
            
            <div class="text-sm text-gray-500 mb-4">
              <p>Întrebări: {{ quiz.questions.length }}</p>
              <p>Creat: {{ new Date(quiz.createdAt).toLocaleDateString() }}</p>
            </div>

            <div class="flex justify-between items-center">
              <button
                @click="editQuiz(quiz)"
                class="text-blue-600 hover:text-blue-800"
              >
                Editează
              </button>
              
              <button 
                v-if="quiz.isPublished"
                @click="copyQuizUrl(quiz._id)"
                class="text-primary hover:text-primary/80"
              >
                Copiază Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pentru quiz nou -->
    <BaseModal v-if="showNewQuizModal" @close="closeNewQuizModal">
      <template #header>
        <h3 class="text-lg font-medium">
          Quiz Nou
        </h3>
      </template>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Titlu
          </label>
          <input 
            v-model="newQuiz.title"
            type="text"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Descriere
          </label>
          <textarea 
            v-model="newQuiz.description"
            rows="3"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button 
            @click="closeNewQuizModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Anulează
          </button>
          <button 
            @click="createQuiz"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            :disabled="!newQuiz.title"
          >
            Creează
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter, useRoute  } from 'vue-router'
import axios from 'axios'
import BaseModal from '@/components/BaseModal.vue'

const API_URL = 'http://localhost:3000/api'
const { getAccessTokenSilently } = useAuth0()
const router = useRouter()
const route = useRoute();

const quizzes = ref([])
const showNewQuizModal = ref(false)
const newQuiz = ref({
  title: '',
  description: ''
})

const loadQuizzes = async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await axios.get(`${API_URL}/quizzes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    quizzes.value = response.data
  } catch (error) {
    console.error('Error loading quizzes:', error)
  }
}

const openNewQuizModal = () => {
  showNewQuizModal.value = true
}

const closeNewQuizModal = () => {
  showNewQuizModal.value = false
  newQuiz.value = {
    title: '',
    description: ''
  }
}

const createQuiz = async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await axios.post(
      `${API_URL}/quizzes`,
      newQuiz.value,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    await loadQuizzes()
    closeNewQuizModal()
    router.push(`/quiz/${response.data._id}/edit`)
  } catch (error) {
    console.error('Error creating quiz:', error)
    alert('Eroare la crearea quizului')
  }
}

const editQuiz = (quiz) => {
  router.push(`/quiz/${quiz._id}/edit`)
}

const copyQuizUrl = (quizId) => {
  const url = `${window.location.origin}/quiz/${quizId}`
  navigator.clipboard.writeText(url)
    .then(() => alert('Link copiat în clipboard!'))
    .catch(err => console.error('Error copying to clipboard:', err))
}

onMounted(async () => {
  await loadQuizzes(); // Load quizzes first
  if (route.query.openModal === 'true') {
    openNewQuizModal();
  }
});

// Watch for changes in route query parameters (if the user navigates with different parameters)
watch(
  () => route.query.openModal,
  (newVal) => {
    if (newVal === 'true') {
      openNewQuizModal();
    }
  }
);
</script>