<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'
const route = useRoute()

// State
const quiz = ref(null)
const currentQuestionIndex = ref(0)
const answers = ref({})
const isLoading = ref(true)
const error = ref(null)
const email = ref('')
const emailError = ref(false)

// Computed
const isCompleted = computed(() => 
  quiz.value?.questions && currentQuestionIndex.value >= quiz.value.questions.length
)

const currentQuestion = computed(() => 
  quiz.value?.questions?.[currentQuestionIndex.value]
)

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

// Methods
const loadQuiz = async () => {
  try {
    const quizId = route.params.id
    const response = await axios.get(`${API_URL}/quiz/${quizId}`)
    quiz.value = response.data
  } catch (error) {
    console.error('Error loading quiz:', error)
    if (error.response?.status === 404) {
      error.value = 'Acest quiz nu există sau nu este publicat.'
    } else {
      error.value = 'A apărut o eroare la încărcarea quizului.'
    }
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
    emailError.value = true
    return
  }

  try {
    const results = {
      quizId: quiz.value._id,
      answers: answers.value,
      email: email.value
    }
    
    await axios.post(`${API_URL}/quiz/submit`, results)
    alert('Rezultatele au fost trimise pe email!')
  } catch (error) {
    console.error('Error submitting results:', error)
    alert('A apărut o eroare la trimiterea rezultatelor')
  }
}

// Load quiz on mount
loadQuiz()
</script>

<template>
  <div class="min-h-screen  py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-600">Se încarcă quizul...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Quiz content -->
      <div v-else-if="quiz" class="bg-white shadow-lg rounded-lg p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ quiz.title }}</h1>
        <p class="text-gray-600 mb-8">{{ quiz.description }}</p>

        <div v-if="!isCompleted" class="space-y-8">
          <!-- Current question -->
          <div v-if="currentQuestion" class="bg-gray-50 rounded-lg p-6">
            <h2 class="text-xl font-medium text-gray-900 mb-6">
              {{ currentQuestion.text }}
            </h2>
            
            <div class="flex gap-4 justify-center">
              <button 
                @click="answerQuestion(true)"
                class="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
              >
                Da
              </button>
              <button 
                @click="answerQuestion(false)"
                class="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-all"
              >
                Nu
              </button>
            </div>

            <!-- Progress bar -->
            <div class="mt-8">
              <div class="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progres</span>
                <span>{{ currentQuestionIndex + 1 }}/{{ quiz.questions.length }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-primary h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${(currentQuestionIndex / quiz.questions.length) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Completion state -->
        <div v-else class="text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Felicitări! Ai terminat quizul
          </h2>
          <p class="text-gray-600">
            Introdu adresa ta de email pentru a primi rezultatele.
          </p>
          
          <div class="mt-8 max-w-md mx-auto">
            <input 
              v-model="email"
              type="email"
              placeholder="Email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              :class="{ 'border-red-500': emailError }"
            />
            <button 
              @click="submitResults"
              class="mt-4 w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
              :disabled="!isValidEmail"
            >
              Trimite Rezultatele
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>