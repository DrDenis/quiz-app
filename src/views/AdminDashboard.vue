<script setup>
import { ref, onMounted } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

const questions = ref([])
const showAddModal = ref(false)
const currentQuestion = ref({
  text: '',
  feedbackYes: '',
  feedbackNo: ''
})

const loadQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/questions`)
    questions.value = response.data
    console.log('Questions loaded:', response.data)
  } catch (error) {
    console.error('Error loading questions:', error)
  }
}

const saveQuestion = async () => {
  try {
    const response = await axios.post(`${API_URL}/questions`, currentQuestion.value)
    console.log('Question saved:', response.data)

    showAddModal.value = false
    currentQuestion.value = {
      text: '',
      feedbackYes: '',
      feedbackNo: ''
    }
    await loadQuestions()
  } catch (error) {
    console.error('Error saving question:', error)
    alert('A apărut o eroare la salvarea întrebării')
  }
}

onMounted(loadQuestions)
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">
          Administrare Întrebări
        </h1>
        <button @click="showAddModal = true" class="bg-primary hover:bg-primary/90 text-gray-800 px-4 py-2 rounded-lg">
          Adaugă Întrebare
        </button>
      </div>

      <!-- Lista întrebări -->
      <div class="bg-white shadow rounded-lg">
        <div class="p-6 space-y-4">
          <div v-for="question in questions" :key="question._id"
            class="border rounded-lg p-4 hover:shadow-md transition-all">
            <h3 class="font-medium">{{ question.text }}</h3>
            <div class="mt-2 text-sm text-gray-600">
              <p>Feedback Da: {{ question.feedbackYes }}</p>
              <p>Feedback Nu: {{ question.feedbackNo }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Adăugare -->
      <BaseModal v-if="showAddModal" @close="showAddModal = false">
        <template #header>
          <h3 class="text-lg font-medium">Adaugă Întrebare Nouă</h3>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Întrebare
            </label>
            <input v-model="currentQuestion.text" type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border-[1px] border-neutral-200 focus:border-primary focus:ring-primary" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Feedback pentru Da
            </label>
            <textarea v-model="currentQuestion.feedbackYes"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border-[1px] border-neutral-200 focus:border-primary focus:ring-primary"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Feedback pentru Nu
            </label>
            <textarea v-model="currentQuestion.feedbackNo"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border-[1px] border-neutral-200 focus:border-primary focus:ring-primary"></textarea>
          </div>
        </div>

        <template #footer>
          <button @click="saveQuestion" class="bg-primary text-gray-800 px-4 py-2 rounded-lg hover:bg-primary/90">
            Salvează
          </button>
        </template>
      </BaseModal>
    </div>
  </div>
</template>