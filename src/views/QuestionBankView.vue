<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-dark-bg transition-colors">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total Questions -->
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
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">în bancă</p>
        </div>

        <!-- Used Questions -->
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
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">în quizuri</p>
        </div>

        <!-- Categories -->
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
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">distincte</p>
        </div>
      </div>

      <!-- Search and Filters -->
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
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <button @click="openAddModal"
              class="px-4 py-2 bg-primary hover:bg-primary/90 text-black rounded-lg transition-colors">
              Adaugă Întrebare
            </button>
          </div>
        </div>
      </div>

      <!-- Questions List -->
      <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
        <!-- Loading State -->
        <div v-if="isLoading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p class="mt-4 text-gray-500 dark:text-gray-400">Se încarcă întrebările...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredQuestions.length === 0" class="p-8 text-center">
          <p class="text-gray-500 dark:text-gray-400">Nu există întrebări care să corespundă filtrelor.</p>
        </div>

        <!-- Questions -->
        <div v-else class="divide-y divide-gray-100 dark:divide-dark-border">
          <div v-for="question in filteredQuestions" :key="question._id"
            class="p-6 hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <!-- Întrebare și Feedback -->
                <h3 class="font-medium text-gray-900 dark:text-white">{{ question.text }}</h3>
                <div class="mt-2 space-y-2">
                  <p class="text-sm ">
                    <span
                      class="px-2 my-3 mr-3 inline-block py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md">
                      Feedback Da
                    </span>
                    {{ question.feedbackYes }}
                  </p>
                  <p class="text-sm">
                    <span class="px-2 mr-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
                      Feedback Nu
                    </span>
                    {{ question.feedbackNo }}
                  </p>
                </div>

                <!-- Usage Info și Metadata -->
                <div class="mt-4 flex flex-wrap items-center gap-4">
                  <!-- Folosire în quizuri -->
                  <div class="flex items-center text-sm">
                    <span class="font-medium text-gray-500 dark:text-gray-400 mr-2">
                      Folosită în:
                    </span>
                    <div v-if="question.usedInQuizzes?.length" class="flex gap-2">
                      <span v-for="quiz in question.usedInQuizzes" :key="quiz._id"
                        class="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md">
                        {{ quiz.title }}
                      </span>
                    </div>
                    <span v-else class="text-gray-500 dark:text-gray-400">
                      Nefolosită
                    </span>
                  </div>

                  <!-- Categorie -->
                  <div v-if="question.category" class="text-sm">
                    <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md">
                      {{ question.category }}
                    </span>
                  </div>

                  <!-- Tags -->
                  <div v-if="question.tags?.length" class="flex gap-2">
                    <span v-for="tag in question.tags" :key="tag"
                      class="text-sm px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-md">
                      #{{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2">
                <button @click="editQuestion(question)"
                  class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="showDeleteOptions(question)"
                  class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
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
    <!-- Add/Edit Modal -->
    <BaseModal v-if="showModal" @close="closeModal">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ editingQuestion ? 'Editează Întrebarea' : 'Adaugă Întrebare Nouă' }}
        </h3>
      </template>

      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Întrebare</label>
          <input v-model="currentQuestion.text" type="text"
            class="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
            placeholder="Introdu întrebarea..." />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Feedback pentru Da</label>
          <textarea v-model="currentQuestion.feedbackYes" rows="3"
            class="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
            placeholder="Feedback pentru răspuns pozitiv..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Feedback pentru Nu</label>
          <textarea v-model="currentQuestion.feedbackNo" rows="3"
            class="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
            placeholder="Feedback pentru răspuns negativ..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categorie</label>
          <input v-model="currentQuestion.category" type="text"
            class="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
            placeholder="Categoria întrebării..." />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button @click="closeModal"
            class="px-4 py-2 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
            Anulează
          </button>
          <button @click="saveQuestion"
            class="px-4 py-2 bg-primary hover:bg-primary/90 text-black rounded-lg transition-colors"
            :disabled="!isValidQuestion">
            {{ editingQuestion ? 'Salvează' : 'Adaugă' }}
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Delete Modal -->
    <BaseModal v-if="showDeleteModal" @close="closeDeleteModal">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Ștergere Întrebare
        </h3>
      </template>

      <div class="space-y-4">
        <p class="text-gray-600 dark:text-gray-300">
          <template v-if="selectedQuestion?.usedInQuizzes?.length">
            Această întrebare este folosită în următoarele quiz-uri:
            <ul class="mt-2 space-y-1">
              <li v-for="quiz in selectedQuestion.usedInQuizzes" :key="quiz._id" class="flex items-center gap-2">
                <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                {{ quiz.title }}
              </li>
            </ul>
          </template>
          <template v-else>
            Ești sigur că vrei să ștergi această întrebare?
          </template>
        </p>

        <div v-if="selectedQuestion?.usedInQuizzes?.length" class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <p class="text-yellow-800 dark:text-yellow-200 text-sm">
            Pentru a șterge întrebarea, aceasta va fi eliminată din toate quiz-urile în care este folosită.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="closeDeleteModal"
            class="px-4 py-2 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
            Anulează
          </button>
          <template v-if="selectedQuestion?.usedInQuizzes?.length">
            <button @click="detachAndDelete"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              Detașează și Șterge
            </button>
          </template>
          <template v-else>
            <button @click="deleteQuestion"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
              Șterge
            </button>
          </template>
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
const showDeleteModal = ref(false)
const editingQuestion = ref(null)
const selectedQuestion = ref(null)
const currentQuestion = ref({
  text: '',
  feedbackYes: '',
  feedbackNo: '',
  category: '',
  tags: []
})
const filters = ref({
  search: '',
  category: ''
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
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      const matchesSearch =
        q.text.toLowerCase().includes(searchTerm) ||
        q.feedbackYes.toLowerCase().includes(searchTerm) ||
        q.feedbackNo.toLowerCase().includes(searchTerm)

      if (!matchesSearch) return false
    }

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
      headers: { Authorization: `Bearer ${token}` }
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
  currentQuestion.value = { text: '', feedbackYes: '', feedbackNo: '', category: '', tags: [] }
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
  currentQuestion.value = { text: '', feedbackYes: '', feedbackNo: '', category: '', tags: [] }
}

const saveQuestion = async () => {
  try {
    const token = await getAccessTokenSilently()
    if (editingQuestion.value) {
      await axios.put(
        `${API_URL}/questions/bank/${editingQuestion.value}`,
        currentQuestion.value,
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } else {
      await axios.post(
        `${API_URL}/questions/bank`,
        currentQuestion.value,
        { headers: { Authorization: `Bearer ${token}` } }
      )
    }
    await loadQuestions()
    closeModal()
  } catch (error) {
    console.error('Error saving question:', error)
    alert('Eroare la salvarea întrebării')
  }
}

const showDeleteOptions = (question) => {
  selectedQuestion.value = question
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedQuestion.value = null
}

const detachAndDelete = async () => {
  try {
    const token = await getAccessTokenSilently()
    await axios.post(
      `${API_URL}/questions/bank/${selectedQuestion.value._id}/detach`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    await deleteQuestion()
  } catch (error) {
    console.error('Error detaching and deleting question:', error)
    alert('Eroare la eliminarea întrebării din quizuri')
  }
}

const deleteQuestion = async () => {
  try {
    const token = await getAccessTokenSilently()
    await axios.delete(
      `${API_URL}/questions/bank/${selectedQuestion.value._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    await loadQuestions()
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting question:', error)
    alert('Eroare la ștergerea întrebării')
  }
}

onMounted(loadQuestions)
</script>