<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
    <div v-if="!isQuizStarted" class="max-w-2xl mx-auto">
      <div class="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-gray-100">
        <h1 class="text-3xl font-semibold text-gray-800 text-center mb-6">
          Evaluare Competențe!!
        </h1>
        <p class="text-gray-600 text-center mb-8 leading-relaxed">
          Acest chestionar te va ajuta să înțelegi mai bine nivelul tău actual și să primești recomandări personalizate
          pentru dezvoltarea ta profesională.
        </p>
        <button @click="startQuiz"
          class="w-full py-3 px-6 bg-primary hover:bg-primary/90 text-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium">
          Începe Evaluarea
        </button>
      </div>
    </div>

    <QuizComponent v-else @quiz-completed="hideIntro = true" :class="{ 'opacity-0 h-0': hideIntro }" />
  </div>
</template>

<script>
import { ref } from 'vue'
import QuizComponent from '@/components/QuizComponent.vue'

export default {
  name: 'QuizPage',
  components: {
    QuizComponent
  },
  setup() {
    const isQuizStarted = ref(false)
    const hideIntro = ref(false)

    const startQuiz = () => {
      isQuizStarted.value = true
    }

    return {
      isQuizStarted,
      hideIntro,
      startQuiz
    }
  }
}
</script>