<!-- src/views/HomeView.vue -->
<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
      <div class="absolute top-20 -left-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"></div>
    </div>

    <!-- Main Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1
          class="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
          Creează Quiz-uri Interactive
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Platformă modernă pentru crearea și gestionarea quiz-urilor personalizate cu feedback instant.
        </p>

        <div class="flex justify-center gap-4">
          <button v-if="!isAuthenticated" @click="handleLogin"
            class="px-8 py-3 bg-gradient-to-r from-primary to-blue-500 text-white rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-200">
            Începe
          </button>
          <router-link v-else to="/dashboard"
            class="px-8 py-3 bg-gradient-to-r from-primary to-blue-500 text-white rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-200">
            Vezi Dashboard
          </router-link>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <div v-for="(feature, index) in features" :key="index"
          class="relative text-center p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
          <div
            class="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-xl opacity-0 group-hover:opacity-10 transition duration-200">
          </div>
          <div class="relative">
            <div
              class="m-x-[auto] w-12 h-12 mb-4 rounded-lg bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center">
              <component :is="feature.icon" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-semibold mb-2 dark:text-white">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';

const { isAuthenticated, loginWithRedirect } = useAuth0();

const handleLogin = () => {
  loginWithRedirect({
    appState: { targetUrl: '/dashboard' }
  });
};

const features = [
  {
    title: 'Quiz-uri Interactive',
    description: 'Creează quiz-uri personalizate cu feedback instant pentru participanți.',
    icon: 'DocumentTextIcon'
  },
  {
    title: 'Bancă de Întrebări',
    description: 'Gestionează și reutilizează întrebările tale în multiple quiz-uri.',
    icon: 'QuestionMarkCircleIcon'
  },
  {
    title: 'Statistici Detaliate',
    description: 'Urmărește performanța și engagement-ul quiz-urilor tale.',
    icon: 'ChartBarIcon'
  }
];

</script>

<script>
// Importăm iconițele de la Heroicons
import { DocumentTextIcon, QuestionMarkCircleIcon, ChartBarIcon } from '@heroicons/vue/outline'

export default {
  components: {
    DocumentTextIcon,
    QuestionMarkCircleIcon,
    ChartBarIcon
  }
}
</script>