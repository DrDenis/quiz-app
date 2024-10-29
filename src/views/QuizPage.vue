<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api'
const route = useRoute()

// State
const quiz = ref(null)
const questions = ref([])
const currentQuestionIndex = ref(0)
const answers = ref({})
const email = ref('')
const emailError = ref(false)
const isLoading = ref(true)
const error = ref(null)

// Computed
const isCompleted = computed(() =>
  questions.value.length > 0 && currentQuestionIndex.value >= questions.value.length
)

const currentQuestion = computed(() =>
  questions.value[currentQuestionIndex.value]
)

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

// Methods
const loadQuiz = async () => {
  try {
    const response = await axios.get(`${API_URL}/quiz/${route.params.id}`)
    quiz.value = response.data
    questions.value = response.data.questions
  } catch (error) {
    console.error('Error loading quiz:', error)
    error.value = error.response?.data?.error || 'Eroare la încărcarea quiz-ului'
  } finally {
    isLoading.value = false
  }
}

const answerQuestion = (answer) => {
  if (currentQuestion.value) {
    answers.value[currentQuestion.value._id] = answer
    currentQuestionIndex.value++
  }
}

const submitResults = async () => {
  if (!isValidEmail.value) {
    emailError.value = true;
    return;
  }

  try {
    const response = await axios.post(`${API_URL}/quiz/submit`, {
      quizId: quiz.value._id,
      email: email.value,
      answers: answers.value
    });

    if (response.data.success) {
      alert('Rezultatele au fost trimise pe email!');
    }
  } catch (error) {
    console.error('Error submitting results:', error);
    console.error('Server response:', error.response?.data);

    let errorMessage = 'A apărut o eroare la trimiterea rezultatelor. ';
    if (error.response?.data?.details) {
      errorMessage += error.response.data.details;
    }

    alert(errorMessage);
  }
};



// Load quiz when component is mounted
loadQuiz()
</script>

<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
    </div>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-500 dark:text-gray-400">Se încarcă quiz-ul...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-lg inline-block">
          {{ error }}
        </div>
      </div>

      <!-- Quiz content -->
      <div v-else-if="quiz"
        class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ quiz.title }}</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">{{ quiz.description }}</p>

        <div v-if="!isCompleted" class="space-y-8">
          <!-- Current question -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h2 class="text-xl font-medium text-gray-900 dark:text-white mb-6">
              {{ currentQuestion.text }}
            </h2>

            <div class="flex gap-4 justify-center">
              <button @click="answerQuestion(true)"
                class="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all">
                Da
              </button>
              <button @click="answerQuestion(false)"
                class="px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-all">
                Nu
              </button>
            </div>

            <!-- Progress bar -->
            <div class="mt-8">
              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progres</span>
                <span>{{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-primary h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${(currentQuestionIndex / questions.length) * 100}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Completion state -->
        <div v-else class="text-center">
          <div class="mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Felicitări! Ai finalizat quiz-ul
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              Introdu adresa ta de email pentru a primi rezultatele.
            </p>
          </div>

          <div class="max-w-md mx-auto">
            <input v-model="email" type="email" placeholder="Email"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white mb-4"
              :class="{ 'border-red-300': emailError }" />
            <button @click="submitResults"
              class="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
              :disabled="!isValidEmail">
              Trimite Rezultatele
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>