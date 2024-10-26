<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Quiz App
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        Create and share your own quizzes or take quizzes created by others.
      </p>

      <div class="space-y-4">
        <template v-if="isAuthenticated">
          <router-link to="/admin"
            class="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Go to Dashboard
          </router-link>
        </template>
        <template v-else>
          <button @click="login"
            class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Login to Create Quiz
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';

const { loginWithRedirect, isAuthenticated } = useAuth0();

const login = () => {
  loginWithRedirect({
    appState: { targetUrl: '/admin' }
  });
};
</script>