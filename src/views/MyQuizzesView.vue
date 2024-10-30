<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm p-6 border border-gray-100 dark:border-dark-border">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Quizuri</h3>
            <span class="p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
              <svg class="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
          </div>
          <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ sortedQuizzes?.length || 0 }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {{ publishedQuizzes?.length || 0 }} publicate
          </p>
        </div>

        <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm p-6 border border-gray-100 dark:border-dark-border">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Completări</h3>
            <span class="p-2 bg-green-50 dark:bg-green-900/50 rounded-lg">
              <svg class="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ totalCompletions }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">în total</p>
        </div>

        <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm p-6 border border-gray-100 dark:border-dark-border">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Întrebări</h3>
            <span class="p-2 bg-purple-50 dark:bg-purple-900/50 rounded-lg">
              <svg class="w-5 h-5 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ totalQuestions }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">în toate quizurile</p>
        </div>
      </div>

      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Quizurile Mele</h1>
        <button @click="createNewQuiz"
          class="px-4 py-2 bg-primary hover:bg-primary/90 text-black rounded-lg transition-all flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Quiz Nou
        </button>
      </div>

      <!-- Quiz List -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="quiz in sortedQuizzes" :key="quiz._id"
          class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-md transition-all duration-200">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ quiz.title }}</h2>
              <span
                :class="quiz.isPublished ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'"
                class="px-2 py-1 text-xs rounded-full">
                {{ quiz.isPublished ? 'Publicat' : 'Ciornă' }}
              </span>
            </div>

            <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 text-left">{{ quiz.description }}</p>

            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907" />
                </svg>
                {{ quiz.questions?.length || 0 }} întrebări
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ quiz.completions || 0 }} completări
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(quiz.createdAt) }}
              </div>
            </div>

            <div class="flex justify-between items-center">
              <div class="flex gap-2">
                <router-link :to="`/quiz/${quiz._id}/edit`"
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm">
                  Editează
                </router-link>
                <button @click="confirmDelete(quiz)"
                  class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm">
                  Șterge
                </button>
              </div>

              <button v-if="quiz.isPublished" @click="copyQuizUrl(quiz._id)"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Quiz Modal -->
    <BaseModal v-if="showCreateModal" @close="closeCreateModal">
      <template #header>
        <h3 class="text-lg font-medium dark:text-gray-100">Quiz Nou</h3>
      </template>

      <div class="space-y-6">
        <!-- Tip Quiz -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tip Quiz
          </label>
          <select v-model="newQuiz.type"
            class="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white">
            <option value="self-evaluation">Auto-evaluare</option>
            <option value="statistical">Statistic</option>
          </select>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ quizTypeDescription }}
          </p>
        </div>

        <!-- Titlu -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Titlu
          </label>
          <input v-model="newQuiz.title" type="text"
            class="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white" />
        </div>

        <!-- Descriere -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descriere
          </label>
          <textarea v-model="newQuiz.description" rows="3"
            class="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white"></textarea>
        </div>

        <!-- Setări pentru quiz statistic -->
        <div v-if="newQuiz.type === 'statistical'" class="space-y-4">
          <h4 class="font-medium text-gray-900 dark:text-white">Setări Statistici</h4>

          <div class="space-y-2">
            <!-- Colectare date demografice -->
            <label class="flex items-center">
              <input type="checkbox" v-model="newQuiz.settings.statistical.collectDemographics"
                class="rounded border-gray-300 text-primary focus:ring-primary" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Colectează date demografice
              </span>
            </label>

            <!-- Vizibilitate rezultate -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vizibilitate Rezultate
              </label>
              <select v-model="newQuiz.settings.statistical.resultsVisibility"
                class="w-full px-4 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white">
                <option value="private">Private (doar admin)</option>
                <option value="after-completion">După completare</option>
                <option value="public">Public</option>
              </select>
            </div>

            <!-- Permitere răspunsuri anonime -->
            <label class="flex items-center mt-2">
              <input type="checkbox" v-model="newQuiz.settings.statistical.allowAnonymous"
                class="rounded border-gray-300 text-primary focus:ring-primary" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Permite răspunsuri anonime
              </span>
            </label>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="closeCreateModal"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            Anulează
          </button>
          <button @click="submitNewQuiz" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            :disabled="!newQuiz.title">
            Creează
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'
import BaseModal from '@/components/BaseModal.vue'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api'
const router = useRouter()
const { getAccessTokenSilently } = useAuth0()

const quizzes = ref([])
const showCreateModal = ref(false)
const newQuiz = ref({
  title: '',
  description: '',
  type: 'self-evaluation',
  settings: {
    statistical: {
      collectDemographics: false,
      allowAnonymous: true,
      resultsVisibility: 'after-completion',
      demographicFields: []
    }
  }
});

const quizTypeDescription = computed(() => {
  if (newQuiz.value.type === 'statistical') {
    return 'Quiz pentru colectare de date și analiză statistică. Permite vizualizarea rezultatelor agregate și demografice.';
  }
  return 'Quiz clasic pentru auto-evaluare, cu feedback personalizat pentru fiecare răspuns.';
});

// Sortăm quizurile - publicate primele
const sortedQuizzes = computed(() => {
  if (!quizzes.value) return [];
  return [...quizzes.value].sort((a, b) => {
    if (a.isPublished === b.isPublished) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return b.isPublished - a.isPublished;
  });
});

const publishedQuizzes = computed(() => {
  if (!quizzes.value) return [];
  return quizzes.value.filter(q => q.isPublished);
})

const totalQuestions = computed(() => {
  if (!quizzes.value) return 0;
  return quizzes.value.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0);
})

const totalCompletions = computed(() => {
  if (!quizzes.value) return 0;
  return quizzes.value.reduce((sum, quiz) => sum + (quiz.completions || 0), 0);
})

const loadQuizzes = async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await axios.get(`${API_URL}/quizzes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    quizzes.value = response.data
  } catch (error) {
    console.error('Error loading quizzes:', error)
    quizzes.value = []
  }
}

const createNewQuiz = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  newQuiz.value = {
    title: '',
    description: '',
    type: 'self-evaluation',
    settings: {
      statistical: {
        collectDemographics: false,
        allowAnonymous: true,
        resultsVisibility: 'after-completion',
        demographicFields: []
      }
    }
  }
}

const submitNewQuiz = async () => {
  try {
    const token = await getAccessTokenSilently();
    const response = await axios.post(
      `${API_URL}/quizzes`,
      newQuiz.value,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    closeCreateModal();
    router.push(`/quiz/${response.data._id}/edit`);
  } catch (error) {
    console.error('Error creating quiz:', error);
    alert('Eroare la crearea quiz-ului');
  }
};

const confirmDelete = async (quiz) => {
  if (!confirm(`Ești sigur că vrei să ștergi quiz-ul "${quiz.title}"? Această acțiune nu poate fi anulată.`)) {
    return;
  }

  try {
    const token = await getAccessTokenSilently();
    const response = await axios.delete(`${API_URL}/quizzes/${quiz._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      // Eliminăm quiz-ul din lista locală
      quizzes.value = quizzes.value.filter(q => q._id !== quiz._id);
    } else {
      throw new Error('Failed to delete quiz');
    }
  } catch (error) {
    console.error('Error deleting quiz:', error);
    if (error.response?.status === 404) {
      alert('Quiz-ul nu a fost găsit.');
    } else {
      alert('A apărut o eroare la ștergerea quiz-ului.');
    }
  }
}

const copyQuizUrl = (quizId) => {
  const url = `${window.location.origin}/quiz/${quizId}`
  navigator.clipboard.writeText(url)
    .then(() => alert('Link copiat în clipboard!'))
    .catch(err => console.error('Error copying to clipboard:', err))
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Inițializare
onMounted(() => {
  loadQuizzes()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>