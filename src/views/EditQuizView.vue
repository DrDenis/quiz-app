<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ quiz.title }}
          </h1>
          <p class="text-gray-600">{{ quiz.description }}</p>
        </div>
        <div class="flex items-center gap-4">
          <button
            v-if="!quiz.isPublished"
            @click="publishQuiz"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Publică Quiz
          </button>
          <button
            v-else
            @click="unpublishQuiz"
            class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Retrage din Publicare
          </button>
          <button
            @click="openAddQuestionModal"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Adaugă Întrebare
          </button>
        </div>
      </div>

      <!-- Lista întrebări -->
      <div class="bg-white shadow rounded-lg">
        <div class="p-6">
          <div v-if="quiz.questions?.length === 0" class="text-center py-12 text-gray-500">
            Nu există întrebări încă. Începe prin a adăuga una!
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="(question, index) in quiz.questions" 
              :key="index"
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium">{{ question.text }}</h3>
                  <div class="mt-2 text-sm text-gray-600">
                    <p><span class="font-medium">Feedback Da:</span> {{ question.feedbackYes }}</p>
                    <p><span class="font-medium">Feedback Nu:</span> {{ question.feedbackNo }}</p>
                  </div>
                </div>
                <button
                  @click="deleteQuestion(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  Șterge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pentru adăugare întrebare -->
    <BaseModal 
      v-if="showAddQuestionModal" 
      @close="closeAddQuestionModal"
    >
      <template #header>
        <h3 class="text-lg font-medium">
          Adaugă Întrebare Nouă
        </h3>
      </template>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Întrebare
          </label>
          <input 
            v-model="newQuestion.text"
            type="text"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Introdu întrebarea..."
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Feedback pentru Da
          </label>
          <textarea 
            v-model="newQuestion.feedbackYes"
            rows="3"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Feedback pentru răspuns pozitiv..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Feedback pentru Nu
          </label>
          <textarea 
            v-model="newQuestion.feedbackNo"
            rows="3"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Feedback pentru răspuns negativ..."
          ></textarea>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button 
            @click="closeAddQuestionModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Anulează
          </button>
          <button 
            @click="addQuestion"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            :disabled="!isValidQuestion"
          >
            Adaugă
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios'
import BaseModal from '@/components/BaseModal.vue'

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

const showAddQuestionModal = ref(false)
const newQuestion = ref({
  text: '',
  feedbackYes: '',
  feedbackNo: ''
})

const isValidQuestion = computed(() => 
  newQuestion.value.text?.trim() &&
  newQuestion.value.feedbackYes?.trim() &&
  newQuestion.value.feedbackNo?.trim()
)

const loadQuiz = async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await axios.get(
      `${API_URL}/quizzes/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    quiz.value = response.data
  } catch (error) {
    console.error('Error loading quiz:', error)
    router.push('/my-quizzes')
  }
}

const openAddQuestionModal = () => {
  showAddQuestionModal.value = true
}

const closeAddQuestionModal = () => {
  showAddQuestionModal.value = false
  newQuestion.value = {
    text: '',
    feedbackYes: '',
    feedbackNo: ''
  }
}

const addQuestion = async () => {
  try {
    const token = await getAccessTokenSilently()
    await axios.post(
      `${API_URL}/quizzes/${route.params.id}/questions`,
      newQuestion.value,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    await loadQuiz()
    closeAddQuestionModal()
  } catch (error) {
    console.error('Error adding question:', error)
    alert('Eroare la adăugarea întrebării')
  }
}

const deleteQuestion = async (index) => {
  if (!confirm('Ești sigur că vrei să ștergi această întrebare?')) return

  try {
    const token = await getAccessTokenSilently()
    await axios.delete(
      `${API_URL}/quizzes/${route.params.id}/questions/${index}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    await loadQuiz()
  } catch (error) {
    console.error('Error deleting question:', error)
    alert('Eroare la ștergerea întrebării')
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
    alert('Eroare la publicarea quizului')
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
    alert('Eroare la retragerea quizului din publicare')
  }
}

onMounted(loadQuiz)
</script>