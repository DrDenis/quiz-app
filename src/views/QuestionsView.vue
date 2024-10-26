<!-- src/views/AdminDashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">
          Administrare Întrebări
        </h1>
        <button @click="openAddModal()"
          class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-all">
          Adaugă Întrebare
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Lista întrebări -->
      <div v-else-if="questions.length > 0" class="bg-white shadow rounded-lg">
        <div class="p-6 space-y-4">
          <div v-for="question in questions" :key="question._id"
            class="border rounded-lg p-4 hover:shadow-md transition-all">
        
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-medium text-lg mb-2">{{ question.text }}</h3>
                  <div class="space-y-2 text-sm text-gray-600">
                    <p><span class="font-medium">Feedback Da:</span> {{ question.feedbackYes }}</p>
                    <p><span class="font-medium">Feedback Nu:</span> {{ question.feedbackNo }}</p>
                  </div>
                </div>
                <div class="flex space-x-2 ml-4">
                  <button @click="openEditModal(question)"
                    class="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50 transition-all">
                    <span class="text-sm">Editează</span>
                  </button>
                  <button @click="confirmDelete(question)"
                    class="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50 transition-all">
                    <span class="text-sm">Șterge</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No questions state -->
        <div v-else class="text-center py-12 bg-white shadow rounded-lg">
          <p class="text-gray-600">Nu există întrebări încă. Începe prin a adăuga una!</p>
        </div>

        <BaseModal v-if="showModal" @close="closeModal">
  <template #header>
    <h3 class="text-lg font-medium">
      {{ editingQuestion ? 'Editează Întrebarea' : 'Adaugă Întrebare Nouă' }}
    </h3>
  </template>

  <!-- Conținutul modalului vine aici -->
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Întrebare
      </label>
      <input 
        v-model="currentQuestion.text"
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
        v-model="currentQuestion.feedbackYes"
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
        v-model="currentQuestion.feedbackNo"
        rows="3"
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        placeholder="Feedback pentru răspuns negativ..."
      ></textarea>
    </div>
  </div>

  <template #footer>
    <div class="flex justify-end space-x-3">
      <button 
        @click="closeModal"
        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
      >
        Anulează
      </button>
      <button 
        @click="saveQuestion"
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Se salvează...' : (editingQuestion ? 'Salvează' : 'Adaugă') }}
      </button>
    </div>
  </template>
</BaseModal>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios'
import BaseModal from '@/components/BaseModal.vue'

const API_URL = 'http://localhost:3000/api'
const { getAccessTokenSilently } = useAuth0()

const questions = ref([])
const showModal = ref(false)
const currentQuestion = ref({
  text: '',
  feedbackYes: '',
  feedbackNo: ''
})
const editingQuestion = ref(null)
const isLoading = ref(false)

const getAuthHeaders = async () => {
  const token = await getAccessTokenSilently()
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

const loadQuestions = async () => {
  isLoading.value = true;
  try {
    const config = await getAuthHeaders();
    console.log('Requesting questions...');

    const response = await axios.get(`${API_URL}/questions`, config);
    console.log('Response received:', response.data);

    questions.value = response.data;
    console.log('Questions set to:', questions.value);
  } catch (error) {
    console.error('Error loading questions:', error);
  } finally {
    isLoading.value = false;
  }
};

const openAddModal = () => {
  editingQuestion.value = null
  // Asigură-te că toate câmpurile sunt inițializate
  currentQuestion.value = {
    text: '',
    feedbackYes: '',
    feedbackNo: ''
  }
  showModal.value = true
}

const openEditModal = (question) => {
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
    feedbackNo: ''
  }
}

const saveQuestion = async () => {
  isLoading.value = true
  try {
    // Validare pe frontend
    if (!currentQuestion.value.text?.trim()) {
      throw new Error('Întrebarea este obligatorie')
    }
    if (!currentQuestion.value.feedbackYes?.trim()) {
      throw new Error('Feedback-ul pentru DA este obligatoriu')
    }
    if (!currentQuestion.value.feedbackNo?.trim()) {
      throw new Error('Feedback-ul pentru NU este obligatoriu')
    }

    const questionData = {
      text: currentQuestion.value.text.trim(),
      feedbackYes: currentQuestion.value.feedbackYes.trim(),
      feedbackNo: currentQuestion.value.feedbackNo.trim()
    }

    console.log('Sending question data:', questionData)

    const config = await getAuthHeaders()
    config.headers['Content-Type'] = 'application/json'
    
    if (editingQuestion.value) {
      const response = await axios.put(
        `${API_URL}/questions/${editingQuestion.value}`, 
        questionData,
        config
      )
      console.log('Update response:', response.data)
    } else {
      const response = await axios.post(
        `${API_URL}/questions`, 
        questionData,
        config
      )
      console.log('Create response:', response.data)
    }
    
    await loadQuestions()
    closeModal()
  } catch (error) {
    console.error('Error details:', error)
    console.error('Response data:', error.response?.data)
    alert(error.response?.data?.error || error.message || 'Eroare la salvarea întrebării')
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = async (question) => {
  if (confirm('Ești sigur că vrei să ștergi această întrebare?')) {
    try {
      const config = await getAuthHeaders()
      await axios.delete(`${API_URL}/questions/${question._id}`, config)
      await loadQuestions()
    } catch (error) {
      console.error('Error deleting question:', error)
      alert('Eroare la ștergerea întrebării')
    }
  }
}

onMounted(loadQuestions)
</script>