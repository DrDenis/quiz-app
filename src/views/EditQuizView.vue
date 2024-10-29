<!-- src/views/EditQuizView.vue -->
<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Card -->
      <div
        class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 mb-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ quiz?.title || 'Loading...' }}</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">{{ quiz?.description }}</p>
          </div>
          <div class="flex items-center gap-3">
            <button v-if="quiz && !quiz.isPublished" @click="publishQuiz"
              class="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Publică Quiz
            </button>
            <button v-if="quiz?.isPublished" @click="unpublishQuiz"
              class="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Retrage din Publicare
            </button>
            <div class="flex gap-2">
              <button @click="openNewQuestionModal"
                class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Întrebare Nouă
              </button>
              <button @click="openQuestionSelector"
                class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
                Adaugă din Bancă
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Questions List -->
      <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Întrebările Quiz-ului</h2>

          <!-- Empty State -->
          <div v-if="!quiz?.questions?.length" class="text-center py-12">
            <p class="text-gray-500 dark:text-gray-400 mb-4">Nu există întrebări încă.</p>
            <div class="flex justify-center gap-2">
              <button @click="openNewQuestionModal" class="text-primary hover:text-primary/90 font-medium">
                Adaugă prima întrebare
              </button>
              <span class="text-gray-400">sau</span>
              <button @click="openQuestionSelector" class="text-primary hover:text-primary/90 font-medium">
                Alege din bancă
              </button>
            </div>
          </div>

          <!-- Questions List with Drag & Drop -->
          <draggable v-else v-model="quiz.questions" class="space-y-4" @end="handleReorder"
            :item-key="item => item.question?._id || item._id" handle=".drag-handle">
            <template #item="{ element: questionItem }">
              <div
                class="border border-gray-100 dark:border-dark-border rounded-xl p-4 bg-white dark:bg-dark-card hover:shadow-md transition-all">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <button class="drag-handle p-2 text-gray-400 hover:text-gray-600 cursor-move">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                        </svg>
                      </button>
                      <h3 class="font-medium text-gray-900 dark:text-gray-100">
                        {{ questionItem.question?.text || questionItem.text }}
                      </h3>
                    </div>
                    <div class="mt-3 ml-11 space-y-2">
                      <div class="flex items-center gap-2 text-sm">
                        <span class="px-2 py-1 bg-green-50 text-green-700 rounded-md">Feedback Da</span>
                        <p class="text-gray-600 dark:text-gray-300">{{ questionItem.question?.feedbackYes ||
                          questionItem.feedbackYes }}
                        </p>
                      </div>
                      <div class="flex items-center gap-2 text-sm">
                        <span class="px-2 py-1 bg-red-50 text-red-700 rounded-md">Feedback Nu</span>
                        <p class="text-gray-600 dark:text-gray-300">{{ questionItem.question?.feedbackNo ||
                          questionItem.feedbackNo }}</p>
                      </div>
                    </div>
                  </div>
                  <button @click="removeQuestion(questionItem)"
                    class="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>

    <BaseModal v-if="showQuestionSelector" @close="closeQuestionSelector" class="">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Selectează Întrebări din Bancă
        </h3>
      </template>

      <div class="space-y-4">
        <div class="flex gap-4 mb-6">
          <div class="flex-1">
            <input v-model="questionSearch" type="text" placeholder="Caută întrebări..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
        </div>

        <div class="max-h-[60vh] overflow-y-auto pr-2">
          <div v-if="!availableQuestions.length" class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">Nu există întrebări disponibile.</p>
            <button @click="openNewQuestionModal" class="text-primary hover:text-primary/90 font-medium mt-2">
              Creează o întrebare nouă
            </button>
          </div>

          <div v-else class="space-y-4">
            <div v-for="question in availableQuestions" :key="question._id"
              class="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
              <input type="checkbox" :value="question._id" v-model="selectedQuestions"
                class="mt-1 rounded text-primary focus:ring-primary" />
              <div class="ml-3">
                <p class="font-medium text-gray-900 dark:text-white">{{ question.text }}</p>
                <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <p><span class="font-medium">Feedback Da:</span> {{ question.feedbackYes }}</p>
                  <p><span class="font-medium">Feedback Nu:</span> {{ question.feedbackNo }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="closeQuestionSelector"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            Anulează
          </button>
          <button @click="addSelectedQuestions" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            :disabled="selectedQuestions.length === 0">
            {{ selectedQuestions.length ? `Adaugă ${selectedQuestions.length} întrebări` : 'Selectează întrebări' }}
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Modal pentru întrebare nouă -->
    <BaseModal v-if="showNewQuestionModal" @close="closeNewQuestionModal">
      <template #header>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Adaugă Întrebare Nouă
        </h3>
      </template>

      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Întrebare
          </label>
          <input v-model="newQuestion.text" type="text"
            class="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
            placeholder="Introdu întrebarea..." />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Feedback pentru Da
          </label>
          <textarea v-model="newQuestion.feedbackYes" rows="3"
            class="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
            placeholder="Feedback pentru răspuns pozitiv..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Feedback pentru Nu
          </label>
          <textarea v-model="newQuestion.feedbackNo" rows="3"
            class="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
            placeholder="Feedback pentru răspuns negativ..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categorie (opțional)
          </label>
          <input v-model="newQuestion.category" type="text"
            class="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"
            placeholder="Categoria întrebării..." />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="closeNewQuestionModal"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            Anulează
          </button>
          <button @click="saveNewQuestion" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            :disabled="!isValidQuestion">
            Adaugă
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import BaseModal from '@/components/BaseModal.vue'
import draggable from 'vuedraggable'

const API_URL = 'http://localhost:3000/api'
const route = useRoute()
const router = useRouter()
const { getAccessTokenSilently } = useAuth0()

// State
const quiz = ref({
  title: '',
  description: '',
  questions: [],
  isPublished: false
})

const bankQuestions = ref([])
const showQuestionSelector = ref(false)
const showNewQuestionModal = ref(false)
const selectedQuestions = ref([])
const questionSearch = ref('')

// State pentru întrebare nouă
const newQuestion = ref({
  text: '',
  feedbackYes: '',
  feedbackNo: '',
  category: ''
})

// Computed
const availableQuestions = computed(() => {
  const search = questionSearch.value.toLowerCase()
  const existingIds = new Set(quiz.value.questions.map(q => q.question?._id || q._id))

  return bankQuestions.value
    .filter(q => !existingIds.has(q._id))
    .filter(q =>
      search === '' ||
      q.text.toLowerCase().includes(search) ||
      q.feedbackYes.toLowerCase().includes(search) ||
      q.feedbackNo.toLowerCase().includes(search)
    )
})

const isValidQuestion = computed(() => {
  return newQuestion.value.text?.trim() &&
    newQuestion.value.feedbackYes?.trim() &&
    newQuestion.value.feedbackNo?.trim()
})

// Methods
const loadQuiz = async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await axios.get(`${API_URL}/quizzes/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    quiz.value = response.data
  } catch (error) {
    console.error('Error loading quiz:', error)
    router.push('/my-quizzes')
  }
}

const loadBankQuestions = async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await axios.get(`${API_URL}/questions/bank`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    bankQuestions.value = response.data
  } catch (error) {
    console.error('Error loading bank questions:', error)
  }
}

const publishQuiz = async () => {
  try {
    const token = await getAccessTokenSilently()
    await axios.patch(
      `${API_URL}/quizzes/${route.params.id}/publish`,
      { isPublished: true },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    await loadQuiz()
  } catch (error) {
    console.error('Error publishing quiz:', error)
    alert('Eroare la publicarea quiz-ului')
  }
}

const unpublishQuiz = async () => {
  try {
    const token = await getAccessTokenSilently()
    await axios.patch(
      `${API_URL}/quizzes/${route.params.id}/publish`,
      { isPublished: false },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    await loadQuiz()
  } catch (error) {
    console.error('Error unpublishing quiz:', error)
    alert('Eroare la retragerea quiz-ului')
  }
}

const openNewQuestionModal = () => {
  showNewQuestionModal.value = true
  showQuestionSelector.value = false // Închidem celălalt modal dacă e deschis
  newQuestion.value = {
    text: '',
    feedbackYes: '',
    feedbackNo: '',
    category: ''
  }
}

const closeNewQuestionModal = () => {
  showNewQuestionModal.value = false
  newQuestion.value = {
    text: '',
    feedbackYes: '',
    feedbackNo: '',
    category: ''
  }
}

const saveNewQuestion = async () => {
  try {
    const token = await getAccessTokenSilently()

    // 1. Salvăm întrebarea în bancă
    const response = await axios.post(
      `${API_URL}/questions/bank`,
      newQuestion.value,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    // 2. Adăugăm întrebarea la quiz
    await axios.patch(
      `${API_URL}/quizzes/${route.params.id}/assign-questions`,
      { questionIds: [response.data._id] },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    // 3. Reîncărcăm datele
    await Promise.all([
      loadQuiz(),
      loadBankQuestions()
    ])

    closeNewQuestionModal()
    alert('Întrebarea a fost adăugată cu succes!')
  } catch (error) {
    console.error('Error saving new question:', error)
    alert('Eroare la salvarea întrebării')
  }
}

const handleReorder = async () => {
  try {
    const token = await getAccessTokenSilently()
    const orderedQuestions = quiz.value.questions.map(q => ({
      question: q.question?._id || q._id,
      order: quiz.value.questions.indexOf(q)
    }))

    await axios.put(
      `${API_URL}/quizzes/${route.params.id}`,
      { questions: orderedQuestions },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  } catch (error) {
    console.error('Error reordering questions:', error)
    alert('Eroare la reordonarea întrebărilor')
  }
}

const openQuestionSelector = () => {
  selectedQuestions.value = []
  showQuestionSelector.value = true
  showNewQuestionModal.value = false // Închidem celălalt modal dacă e deschis
}

const closeQuestionSelector = () => {
  showQuestionSelector.value = false
  selectedQuestions.value = []
  questionSearch.value = ''
}

const addSelectedQuestions = async () => {
  try {
    const token = await getAccessTokenSilently()
    await axios.patch(
      `${API_URL}/quizzes/${route.params.id}/assign-questions`,
      { questionIds: selectedQuestions.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    await loadQuiz()
    closeQuestionSelector()
  } catch (error) {
    console.error('Error adding questions:', error)
    alert('Eroare la adăugarea întrebărilor')
  }
}

const removeQuestion = async (questionItem) => {
  if (!confirm('Ești sigur că vrei să elimini această întrebare din quiz?')) {
    return
  }

  try {
    const token = await getAccessTokenSilently()
    const updatedQuestions = quiz.value.questions.filter(q => {
      const qId = q.question?._id || q._id
      const itemId = questionItem.question?._id || questionItem._id
      return qId !== itemId
    })

    await axios.put(
      `${API_URL}/quizzes/${route.params.id}`,
      { questions: updatedQuestions },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    await loadQuiz()
  } catch (error) {
    console.error('Error removing question:', error)
    alert('Eroare la eliminarea întrebării')
  }
}

// Initialization
onMounted(() => {
  loadQuiz()
  loadBankQuestions()
})
</script>