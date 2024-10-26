<template>
  <div>
    <button v-if="!isAuthenticated" @click="login"
      class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-all">
      Log In
    </button>

    <div v-else class="flex items-center space-x-4">
      <span class="text-sm text-gray-600">{{ user?.email }}</span>
      <button @click="logout" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-all">
        Log Out
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const {
  loginWithRedirect,
  logout: auth0Logout,
  user,
  isAuthenticated,
} = useAuth0();

const login = () => {
  loginWithRedirect({
    appState: { targetUrl: '/admin' }  // Adăugat pentru redirect
  });
}

const logout = () => {
  auth0Logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
}
</script>