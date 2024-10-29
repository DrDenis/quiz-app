<!-- src/views/EditQuizView.vue -->
<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Card -->
      <div
        class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 mb-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-dark-text">
              {{ quiz?.title || 'Loading...' }}
            </h1>
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
          </div>
        </div>
      </div>

      <!-- Questions Section -->
      <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-dark-text">Întrebările Quiz-ului</h2>
            <button @click="openQuestionSelector"
              class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Adaugă Întrebări
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="!quiz?.questions?.length" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-500 dark:text-gray-400 mb-4">Nu există întrebări încă.</p>
            <button @click="openQuestionSelector" class="text-primary hover:text-primary/90 font-medium">
              Adaugă prima întrebare
            </button>
          </div>

          <!-- Questions List -->
          <draggable v-else v-model="quiz.questions" class="space-y-4" @end="handleReorder"
            :item-key="item => item.question?._id || item._id" handle=".drag-handle">
            <template #item="{ element: questionItem }">
              <div
                class="border border-gray-100 dark:border-dark-border rounded-xl p-4 bg-white dark:bg-dark-card hover:shadow-md transition-all duration-200">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <button
                        class="drag-handle p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-move">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                        </svg>
                      </button>
                      <h3 class="font-medium text-gray-900 dark:text-dark-text">
                        {{ questionItem.question?.text || questionItem.text }}
                      </h3>
                    </div>

                    <div class="mt-3 ml-11 space-y-2">
                      <div class="flex items-center gap-2 text-sm">
                        <span
                          class="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md">
                          Feedback Da
                        </span>
                        <p class="text-gray-600 dark:text-gray-400">
                          {{ questionItem.question?.feedbackYes || questionItem.feedbackYes }}
                        </p>
                      </div>
                      <div class="flex items-center gap-2 text-sm">
                        <span class="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
                          Feedback Nu
                        </span>
                        <p class="text-gray-600 dark:text-gray-400">
                          {{ questionItem.question?.feedbackNo || questionItem.feedbackNo }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button @click="removeQuestion(questionItem)"
                    class="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors">
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

    <!-- Question Selector Modal -->
    <BaseModal v-if="showQuestionSelector" @close="closeQuestionSelector" class="w-full mx-auto">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-dark-text">
            {{ quiz?.questions?.length ? 'Adaugă mai multe întrebări' : 'Adaugă primele întrebări' }}
          </h3>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ selectedQuestions.length }} întrebări selectate
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <!-- Search and Filters -->
        <div class="flex gap-4 mb-6">
          <div class="flex-1">
            <input v-model="questionSearch" type="text" placeholder="Caută întrebări..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
        </div>

        <!-- Questions List -->
        <div class="max-h-[60vh] overflow-y-auto">
          <div v-if="!availableQuestions.length" class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400 mb-4">Nu există întrebări disponibile.</p>
            <button @click="goToQuestionBank" class="text-primary hover:text-primary/90 font-medium">
              Mergi la Banca de Întrebări
            </button>
          </div>

          <div v-else class="space-y-4">
            <label v-for="question in availableQuestions" :key="question._id"
              class="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-dark-border rounded-lg cursor-pointer">
              <input type="checkbox" :value="question._id" v-model="selectedQuestions"
                class="mt-1 rounded text-primary focus:ring-primary" />
              <div class="ml-3">
                <p class="font-medium text-gray-900 dark:text-dark-text">{{ question.text }}</p>
                <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <p><span class="font-medium">Feedback Da:</span> {{ question.feedbackYes }}</p>
                  <p><span class="font-medium">Feedback Nu:</span> {{ question.feedbackNo }}</p>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <button v-if="!availableQuestions.length" @click="goToQuestionBank"
            class="px-4 py-2 text-primary hover:text-primary/90 font-medium">
            Creează Întrebări Noi
          </button>
          <div class="flex gap-3">
            <button @click="closeQuestionSelector"
              class="px-4 py-2 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border rounded-md">
              Anulează
            </button>
            <button @click="addSelectedQuestions"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
              :disabled="selectedQuestions.length === 0">
              {{ selectedQuestions.length ?
                `Adaugă ${selectedQuestions.length} întrebări` :
                'Selectează întrebări'
              }}
            </button>
          </div>
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

const quiz = ref({
  title: '',
  description: '',
  questions: [],
  isPublished: false
})

const bankQuestions = ref([])
const showQuestionSelector = ref(false)
const selectedQuestions = ref([])
const questionSearch = ref('')
const isLoading = ref(true)

const goToQuestionBank = () => {
  router.push('/questions/bank')
}

const availableQuestions = computed(() => {
  const search = questionSearch.value.toLowerCase()
  const existingIds = new Set(quiz.value?.questions?.map(q =>
    q.question?._id || q._id
  ) || [])

  return bankQuestions.value
    .filter(q => !existingIds.has(q._id))
    .filter(q =>
      search === '' ||
      q.text.toLowerCase().includes(search) ||
      q.feedbackYes.toLowerCase().includes(search) ||
      q.feedbackNo.toLowerCase().includes(search)
    )
})

const loadQuiz = async () => {
  try {
    isLoading.value = true
    const token = await getAccessTokenSilently()
    const response = await axios.get(`${API_URL}/quizzes/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    quiz.value = response.data

    console.log('Loaded quiz:', quiz.value)
  } catch (error) {
    console.error('Error loading quiz:', error)
    if (error.response?.status === 404) {
      router.push('/my-quizzes')
    }
  } finally {
    isLoading.value = false
  }
}

const loadBankQuestions = async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await axios.get(`${API_URL}/questions/bank`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    await loadQuiz()
  } catch (error) {
    console.error('Error publishing quiz:', error)
  }
}

const unpublishQuiz = async () => {
  try {
    const token = await getAccessTokenSilently()
    await axios.patch(
      `${API_URL}/quizzes/${route.params.id}/publish`,
      { isPublished: false },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    await loadQuiz()
  } catch (error) {
    console.error('Error unpublishing quiz:', error)
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
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  } catch (error) {
    console.error('Error reordering questions:', error)
  }
}

const openQuestionSelector = () => {
  selectedQuestions.value = []
  showQuestionSelector.value = true
}

const closeQuestionSelector = () => {
  showQuestionSelector.value = false
  selectedQuestions.value = []
  questionSearch.value = ''
}

const addSelectedQuestions = async () => {
  try {
    const token = await getAccessTokenSilently()

    // Folosim direct selectedQuestions.value pentru ID-uri
    await axios.patch(
      `${API_URL}/quizzes/${route.params.id}/assign-questions`,
      { questionIds: selectedQuestions.value },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
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

    // Filtrăm întrebarea din array-ul de întrebări
    const updatedQuestions = quiz.value.questions.filter(q => {
      const qId = q.question?._id || q._id
      const itemId = questionItem.question?._id || questionItem._id
      return qId !== itemId
    })

    // Facem update la quiz cu noua listă de întrebări
    await axios.put(
      `${API_URL}/quizzes/${route.params.id}`,
      { questions: updatedQuestions },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    // Reîncărcăm quiz-ul
    await loadQuiz()
  } catch (error) {
    console.error('Error removing question:', error)
    alert('Eroare la eliminarea întrebării')
  }
}

onMounted(async () => {
  await loadQuiz()
  await loadBankQuestions()
})
</script>