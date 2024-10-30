<template>
  <div class="space-y-6">
    <!-- Header cu informații și acțiuni -->
    <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm p-6 border border-gray-100 dark:border-dark-border">
      <div class="flex justify-between items-start">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ quiz.title }}</h1>
            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
              Statistic
            </span>
          </div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{{ quiz.description }}</p>
        </div>
        <div class="flex items-center gap-3">
          <button v-if="!quiz.isPublished" @click="publishQuiz"
            class="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Publică Quiz
          </button>
          <button v-else @click="unpublishQuiz"
            class="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Retrage din Publicare
          </button>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
      <div class="border-b border-gray-100 dark:border-gray-700">
        <nav class="flex -mb-px">
          <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id" :class="[
            'px-6 py-3 text-sm font-medium whitespace-nowrap',
            currentTab === tab.id
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]">
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Întrebări Tab -->
        <div v-if="currentTab === 'questions'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Întrebări</h2>
            <div class="flex gap-2">
              <button @click="openNewQuestion"
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

          <!-- Lista de întrebări -->
          <div class="space-y-4">
            <div v-for="(question, index) in quiz.questions" :key="question.question._id"
              class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900 dark:text-white">
                    {{ index + 1 }}. {{ question.question.text }}
                  </h3>

                  <!-- Setări statistici pentru întrebare -->
                  <div class="mt-4 space-y-2">
                    <label class="flex items-center">
                      <input type="checkbox" v-model="question.statisticalData.showInResults"
                        class="rounded border-gray-300 text-primary focus:ring-primary" />
                      <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        Arată în rezultate
                      </span>
                    </label>

                    <div class="flex items-center gap-4">
                      <select v-model="question.statisticalData.chartType"
                        class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg">
                        <option value="pie">Diagramă Circulară</option>
                        <option value="bar">Diagramă cu Bare</option>
                        <option value="line">Grafic Liniar</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button @click="removeQuestion(question)"
                  class="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Setări Tab -->
        <div v-if="currentTab === 'settings'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <!-- Setări Generale -->
            <div class="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-100 dark:border-dark-border">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Setări Generale</h3>

              <div class="space-y-4">
                <div>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="localQuizSettings.statistical.allowAnonymous"
                      class="rounded border-gray-300 text-primary focus:ring-primary" />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Permite răspunsuri anonime
                    </span>
                  </label>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                    Dacă este activat, participanții pot completa quiz-ul fără a se identifica
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vizibilitate Rezultate
                  </label>
                  <select v-model="localQuizSettings.statistical.resultsVisibility"
                    class="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="private">Private (doar admin)</option>
                    <option value="after-completion">După completare</option>
                    <option value="public">Public</option>
                  </select>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Controlează cine poate vedea rezultatele statistice
                  </p>
                </div>
              </div>
            </div>

            <!-- Setări Raportare -->
            <div class="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-100 dark:border-dark-border">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Setări Raportare</h3>

              <div class="space-y-4">
                <div>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="localQuizSettings.statistical.showOverallStats"
                      class="rounded border-gray-300 text-primary focus:ring-primary" />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Arată statistici generale
                    </span>
                  </label>
                </div>

                <div>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="localQuizSettings.statistical.showDemographicBreakdown"
                      class="rounded border-gray-300 text-primary focus:ring-primary" />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Arată defalcare demografică
                    </span>
                  </label>
                </div>

                <div>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="localQuizSettings.statistical.showTrends"
                      class="rounded border-gray-300 text-primary focus:ring-primary" />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Arată tendințe în timp
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Date Demografice Tab -->
        <div v-if="currentTab === 'demographics'" class="space-y-6">
          <div class="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-100 dark:border-dark-border">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Date Demografice</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Configurează câmpurile demografice pentru colectarea datelor
                </p>
              </div>
              <button @click="addDemographicField"
                class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
                Adaugă Câmp
              </button>
            </div>

            <div class="space-y-4">
              <div v-if="!localQuizSettings.statistical.demographicFields?.length" class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">
                  Nu există câmpuri demografice configurate
                </p>
              </div>

              <div v-for="(field, index) in localQuizSettings.statistical.demographicFields" :key="index"
                class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nume Câmp
                    </label>
                    <input v-model="field.name" type="text"
                      class="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tip
                    </label>
                    <select v-model="field.type"
                      class="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                      <option value="text">Text</option>
                      <option value="number">Număr</option>
                      <option value="select">Selecție</option>
                      <option value="date">Dată</option>
                    </select>
                  </div>

                  <div class="flex items-center pt-6">
                    <label class="flex items-center">
                      <input type="checkbox" v-model="field.required"
                        class="rounded border-gray-300 text-primary focus:ring-primary" />
                      <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Obligatoriu
                      </span>
                    </label>
                  </div>
                </div>

                <button @click="removeDemographicField(index)"
                  class="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistici Tab -->
        <div v-if="currentTab === 'statistics'" class="space-y-6">
          <div v-if="!quiz.isPublished || !hasResponses"
            class="bg-white dark:bg-dark-card rounded-xl p-8 border border-gray-100 dark:border-dark-border text-center">
            <div class="mb-4">
              <svg class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {{ !quiz.isPublished ? 'Quiz-ul nu este publicat' : 'Nu există răspunsuri încă' }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              {{ !quiz.isPublished
                ? 'Publică quiz-ul pentru a începe să colectezi răspunsuri'
                : 'Statisticile vor fi disponibile după ce quiz-ul începe să primească răspunsuri'
              }}
            </p>
          </div>

          <StatisticalDashboard v-else :quiz="quiz" :statistics="statistics" :overview="statsOverview" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
import StatisticalDashboard from './StatisticalDashboard.vue'

const props = defineProps({
  quiz: {
    type: Object,
    required: true
  },
  statistics: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits([
  'save-settings',
  'update-questions',
  'publish-quiz',
  'unpublish-quiz',
  'open-new-question',
  'open-question-selector',
  'remove-question'
])

const currentTab = ref('questions')
const tabs = [
  { id: 'questions', name: 'Întrebări' },
  { id: 'settings', name: 'Setări' },
  { id: 'demographics', name: 'Date Demografice' },
  { id: 'statistics', name: 'Statistici' }
]

const hasResponses = computed(() => {
  return props.statistics?.totalResponses > 0
})

const localQuizSettings = ref({
  statistical: {
    allowAnonymous: props.quiz.settings?.statistical?.allowAnonymous || false,
    resultsVisibility: props.quiz.settings?.statistical?.resultsVisibility || 'private',
    showOverallStats: props.quiz.settings?.statistical?.showOverallStats || false,
    showDemographicBreakdown: props.quiz.settings?.statistical?.showDemographicBreakdown || false,
    showTrends: props.quiz.settings?.statistical?.showTrends || false,
    demographicFields: props.quiz.settings?.statistical?.demographicFields || []
  }
})

const publishQuiz = () => {
  emit('publish-quiz')
}

const unpublishQuiz = () => {
  emit('unpublish-quiz')
}

const openNewQuestion = () => {
  emit('open-new-question')
}

const openQuestionSelector = () => {
  emit('open-question-selector')
}

const removeQuestion = (question) => {
  emit('remove-question', question)
}

const addDemographicField = () => {
  if (!localQuizSettings.value.statistical.demographicFields) {
    localQuizSettings.value.statistical.demographicFields = []
  }
  const newField = {
    name: '',
    type: 'text',
    required: false,
    options: []
  }
  localQuizSettings.value.statistical.demographicFields.push(newField)
}

const removeDemographicField = (index) => {
  localQuizSettings.value.statistical.demographicFields.splice(index, 1)
}

const statsOverview = computed(() => {
  return [
    {
      title: 'Total Răspunsuri',
      value: props.statistics?.totalResponses || 0,
      icon: 'users',
      color: 'blue'
    },
    {
      title: 'Rata de Finalizare',
      value: `${props.statistics?.completionRate || 0}%`,
      icon: 'check-circle',
      color: 'green'
    },
    {
      title: 'Timp Mediu',
      value: props.statistics?.averageTime || '0m',
      icon: 'clock',
      color: 'yellow'
    },
    {
      title: 'Scor Mediu',
      value: `${props.statistics?.averageScore || 0}%`,
      icon: 'star',
      color: 'purple'
    }
  ]
})

// Watch for changes in settings and emit updates
watch(() => localQuizSettings.value, (newSettings) => {
  emit('save-settings', newSettings)
}, { deep: true })
</script>