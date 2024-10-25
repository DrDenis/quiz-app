<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { jsPDF } from 'jspdf'

const API_URL = 'http://localhost:3000/api'

const questions = ref([])
const currentQuestionIndex = ref(0)
const answers = ref({})
const userEmail = ref('')
const emailError = ref(false)
const isLoading = ref(true)

// Fetch questions from DB
const loadQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/questions`)
    questions.value = response.data
    isLoading.value = false
  } catch (error) {
    console.error('Error loading questions:', error)
    isLoading.value = false
  }
}

const currentQuestion = computed(() =>
  questions.value[currentQuestionIndex.value]
)

const isCompleted = computed(() =>
  currentQuestionIndex.value >= questions.value.length
)

const progress = computed(() =>
  (currentQuestionIndex.value / questions.value.length) * 100
)

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(userEmail.value)
})

const answerQuestion = (answer) => {
  if (currentQuestion.value) {
    answers.value[currentQuestion.value._id] = answer
    currentQuestionIndex.value++
  }
}

const generatePDF = async () => {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    compress: true
  })

  // Header
  doc.setFontSize(22)
  doc.text('Raport de Evaluare', 105, 25, { align: 'center' })

  // Data
  doc.setFontSize(12)
  const date = new Date().toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split('.').join('.')
  doc.text(`Generat la: ${date}`, 105, 35, { align: 'center' })

  let yPos = 50

  // Parcurgere întrebări și răspunsuri
  for (const question of questions.value) {
    const userAnswer = answers.value[question._id]

    // Verifică spațiul disponibil
    if (yPos > 250) {
      doc.addPage()
      yPos = 30
    }

    // Întrebarea
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`${question.text}`, 20, yPos)
    yPos += 10

    // Răspuns
    doc.setFontSize(12)
    doc.text(`Răspuns: ${userAnswer ? 'Da' : 'Nu'}`, 20, yPos, {
      charSpace: 0
    })
    yPos += 8

    // Feedback
    const feedback = userAnswer ? question.feedbackYes : question.feedbackNo
    const splitFeedback = doc.splitTextToSize(feedback, 170)

    doc.setFontSize(12)
    splitFeedback.forEach(line => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 30
      }
      doc.text(line, 20, yPos, {
        charSpace: 0
      })
      yPos += 7
    })

    yPos += 10
  }

  // Footer
  doc.setFontSize(10)
  doc.text('Document generat automat', 105, 280, {
    align: 'center',
    charSpace: 0
  })

  return doc.output('blob')
}

const submitResults = async () => {
  if (!isValidEmail.value) {
    emailError.value = true
    return
  }

  try {
    console.log('Începe generarea PDF-ului')
    const pdfBlob = await generatePDF()
    console.log('PDF generat cu succes')

    const formData = new FormData()
    formData.append('pdf', pdfBlob, 'rezultate.pdf')
    formData.append('email', userEmail.value)

    console.log('Trimitere request către server:', userEmail.value)
    const response = await axios.post(`${API_URL}/send-results`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('Răspuns de la server:', response.data)

    if (response.data.success) {
      alert('Rezultatele au fost trimise pe email!')
    } else {
      throw new Error('Răspuns neașteptat de la server')
    }
  } catch (error) {
    console.error('Eroare completă:', error)
    console.error('Răspuns server (dacă există):', error.response?.data)

    let errorMessage = 'A apărut o eroare. '
    if (error.response) {
      errorMessage += error.response.data.details || error.response.data.error || 'Eroare server'
    } else if (error.request) {
      errorMessage += 'Nu s-a putut contacta serverul'
    } else {
      errorMessage += error.message
    }

    alert(errorMessage)
  }
}

// Load questions when component is mounted
loadQuestions()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-600">Se încarcă întrebările...</p>
      </div>

      <!-- Quiz content -->
      <div v-else-if="!isCompleted && questions.length > 0"
        class="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-gray-100">
        <div class="space-y-6">
          <!-- Progress -->
          <div class="flex items-center justify-between mb-6">
            <span class="text-sm font-medium text-gray-500">
              Progres
            </span>
            <span class="text-sm font-medium text-gray-500">
              {{ currentQuestionIndex + 1 }}/{{ questions.length }}
            </span>
          </div>

          <div class="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div class="bg-primary h-2 rounded-full transition-all duration-300" :style="{ width: `${progress}%` }">
            </div>
          </div>

          <!-- Question -->
          <h2 class="text-2xl font-medium text-gray-800 mb-8">
            {{ currentQuestion.text }}
          </h2>

          <!-- Answer buttons -->
          <div class="flex gap-4 justify-center">
            <button @click="answerQuestion(true)"
              class="flex-1 py-3 px-6 bg-primary hover:bg-primary/90 text-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
              Da
            </button>
            <button @click="answerQuestion(false)"
              class="flex-1 py-3 px-6 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              Nu
            </button>
          </div>
        </div>
      </div>

      <!-- No questions state -->
      <div v-else-if="!isLoading && questions.length === 0" class="text-center py-12">
        <p class="text-gray-600">Nu există întrebări disponibile momentan.</p>
      </div>

      <!-- Completion state -->
      <div v-else class="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-gray-100">
        <div class="text-center space-y-6">
          <div class="mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-2">
              Felicitări! Ai finalizat evaluarea
            </h2>
            <p class="text-gray-600">
              Introdu adresa ta de email pentru a primi raportul personalizat.
            </p>
          </div>

          <div class="max-w-md mx-auto">
            <input type="email" v-model="userEmail" placeholder="email@example.com"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 mb-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
              :class="{ 'border-red-300': emailError }">
            <button @click="submitResults"
              class="w-full py-3 px-6 bg-primary hover:bg-primary/90 text-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              :disabled="!isValidEmail">
              Trimite Rezultatele
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>