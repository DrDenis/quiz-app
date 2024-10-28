<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-dark-bg transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Întrebări</h3>
            <span class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <svg class="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ questions.length }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            în bancă
          </p>
        </div>

        <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Întrebări Folosite</h3>
            <span class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <svg class="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ usedQuestions }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            în quizuri
          </p>
        </div>

        <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Categorii</h3>
            <span class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <svg class="w-5 h-5 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </span>
          </div>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ uniqueCategories }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            distincte
          </p>
        </div>
      </div>
      <!-- Header & Search -->
      <div
        class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="flex-1">
            <input v-model="filters.search" type="text" placeholder="Caută întrebări..."
              class="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white" />
          </div>
          <div class="flex gap-4">
            <select v-model="filters.category"
              class="px-4 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white">
              <option value="">Toate categoriile</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
            <button @click="openAddModal"
              class="px-4 py-2 bg-primary hover:bg-primary/90 text-black rounded-lg transition-colors flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Adaugă Întrebare
            </button>
          </div>
        </div>
      </div>

      <!-- Questions List -->
      <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
        <div v-if="isLoading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p class="mt-4 text-gray-500 dark:text-gray-400">Se încarcă întrebările...</p>
        </div>

        <div v-else-if="filteredQuestions.length === 0" class="p-8 text-center">
          <p class="text-gray-500 dark:text-gray-400">Nu există întrebări care să corespundă filtrelor.</p>
        </div>

        <div v-else class="divide-y divide-gray-100 dark:divide-dark-border">
          <div v-for="question in filteredQuestions" :key="question._id"
            class="p-6 hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="font-medium text-gray-900 dark:text-white text-left">{{ question.text }}</h3>

                <div class="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <p class="text-left">
                    <span
                      class="px-2 inline-block py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md mr-2">
                      Feedback Da
                    </span>
                    {{ question.feedbackYes }}
                  </p>
                  <p class="text-left">
                    <span
                      class="px-2 inline-block py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md mr-2">
                      Feedback Nu
                    </span>
                    {{ question.feedbackNo }}
                  </p>
                </div>

                <!-- Usage & Categories -->
                <div class="mt-4 flex flex-wrap items-center gap-4">
                  <div class="flex items-center text-sm">
                    <span class="font-medium mr-2 text-gray-500 dark:text-gray-400">Folosită în:</span>
                    <div v-if="question.usedInQuizzes?.length" class="flex gap-2">
                      <span v-for="quiz in question.usedInQuizzes" :key="quiz._id"
                        class="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md">
                        {{ quiz.title }}
                      </span>
                    </div>
                    <span v-else class="text-gray-500 dark:text-gray-400">Nefolosită</span>
                  </div>

                  <div v-if="question.category" class="text-sm">
                    <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md">
                      {{ question.category }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button @click="editQuestion(question)"
                  class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="confirmDelete(question)"
                  class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  :disabled="question.usedInQuizzes?.length > 0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Question Modal -->
    <BaseModal v-if="showModal" @close="closeModal">
      <template #header>
        <h3 class="text-lg font-medium">
          {{ editingQuestion ? 'Editează Întrebarea' : 'Adaugă Întrebare Nouă' }}
        </h3>
      </template>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Întrebare
          </label>
          <input v-model="currentQuestion.text" type="text"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Feedback pentru Da
          </label>
          <textarea v-model="currentQuestion.feedbackYes" rows="3"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Feedback pentru Nu
          </label>
          <textarea v-model="currentQuestion.feedbackNo" rows="3"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Categorie
          </label>
          <input v-model="currentQuestion.category" type="text"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Tags (separate prin virgulă)
          </label>
          <input v-model="tagsInput" type="text"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button @click="closeModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Anulează
          </button>
          <button @click="saveQuestion" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            :disabled="!isValidQuestion">
            {{ editingQuestion ? 'Salvează' : 'Adaugă' }}
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios'
import BaseModal from '@/components/BaseModal.vue'

const API_URL = 'http://localhost:3000/api'
const { getAccessTokenSilently } = useAuth0()

// State
const questions = ref([])
const isLoading = ref(true)
const showModal = ref(false)
const editingQuestion = ref(null)
const currentQuestion = ref({
  text: '',
  feedbackYes: '',
  feedbackNo: '',
  category: '',
  tags: []
})

const filters = ref({
  search: '',
  category: '',
  usage: 'all'
})


// Computed
const categories = computed(() => {
  const cats = new Set(questions.value.map(q => q.category).filter(Boolean))
  return Array.from(cats).sort()
})

const uniqueCategories = computed(() => categories.value.length)

const usedQuestions = computed(() =>
  questions.value.filter(q => q.usedInQuizzes?.length > 0).length
)

const filteredQuestions = computed(() => {
  return questions.value.filter(q => {
    // Search filter
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      const matchesSearch =
        q.text.toLowerCase().includes(searchTerm) ||
        q.feedbackYes.toLowerCase().includes(searchTerm) ||
        q.feedbackNo.toLowerCase().includes(searchTerm)

      if (!matchesSearch) return false
    }

    // Category filter
    if (filters.value.category && q.category !== filters.value.category) {
      return false
    }

    return true
  })
})

const isValidQuestion = computed(() => {
  return currentQuestion.value.text?.trim() &&
    currentQuestion.value.feedbackYes?.trim() &&
    currentQuestion.value.feedbackNo?.trim()
})

// Methods
const loadQuestions = async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await axios.get(`${API_URL}/questions/bank`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    questions.value = response.data
  } catch (error) {
    console.error('Error loading questions:', error)
  } finally {
    isLoading.value = false
  }
}

const openAddModal = () => {
  editingQuestion.value = null
  currentQuestion.value = {
    text: '',
    feedbackYes: '',
    feedbackNo: '',
    category: '',
    tags: []
  }
  showModal.value = true
}

const editQuestion = (question) => {
  editingQuestion.value = question._id
  currentQuestion.value = { ...question }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingQuestion.value = null
  currentQuestion.value = {
    text: '',
    feedbackYes: '',
    feedbackNo: '',
    category: '',
    tags: []
  }
}

const saveQuestion = async () => {
  try {
    const token = await getAccessTokenSilently()

    if (editingQuestion.value) {
      await axios.put(
        `${API_URL}/questions/bank/${editingQuestion.value}`,
        currentQuestion.value,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    } else {
      await axios.post(
        `${API_URL}/questions/bank`,
        currentQuestion.value,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    }

    await loadQuestions()
    closeModal()
  } catch (error) {
    console.error('Error saving question:', error)
    alert('Eroare la salvarea întrebării')
  }
}

const confirmDelete = async (question) => {
  if (question.usedInQuizzes?.length > 0) {
    alert('Nu poți șterge o întrebare care este folosită în quizuri.')
    return
  }

  if (!confirm('Ești sigur că vrei să ștergi această întrebare?')) {
    return
  }

  try {
    const token = await getAccessTokenSilently()
    await axios.delete(`${API_URL}/questions/bank/${question._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    await loadQuestions()
  } catch (error) {
    console.error('Error deleting question:', error)
    alert('Eroare la ștergerea întrebării')
  }
}

onMounted(loadQuestions)
</script>