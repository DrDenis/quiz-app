<!-- NavBar.vue -->
<template>
  <nav
    class="sticky top-0 z-40 w-full transition-colors duration-500 lg:z-50 backdrop-blur-md bg-white/70 supports-backdrop-blur:bg-white/60 dark:bg-slate-900/70 border-b border-slate-900/10 dark:border-slate-50/[0.06]">
    <div class="relative">
      <!-- Background shapes -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl"></div>
        <div class="absolute right-0 top-0 w-32 h-32 rounded-full bg-blue-500/20 blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="flex justify-between align-middle h-20">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/"
              class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              Quiz App
            </router-link>
          </div>

          <div class="flex items-center gap-6">
            <!-- Skeleton loader -->
            <div v-if="isLoading" class="flex items-center gap-4">
              <div class="h-8 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
              <div class="h-8 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>

            <!-- Nav Links & User Menu -->
            <template v-else>
              <template v-if="isAuthenticated">
                <div class="flex gap-6">
                  <router-link v-for="link in navLinks" :key="link.path" :to="link.path"
                    class="nav-link relative group">
                    <span class="relative z-10">{{ link.name }}</span>
                    <div
                      class="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform">
                    </div>
                  </router-link>
                </div>

                <!-- User Menu -->
                <div class="relative group">
                  <button
                    class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <span class="text-sm font-medium">{{ user.given_name }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500 dark:text-gray-400"
                      viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
                    </svg>
                  </button>

                  <!-- Dropdown Menu -->
                  <div
                    class="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <router-link to="/profile"
                      class="block text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
                      Contul meu
                    </router-link>
                    <button @click="handleLogout"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700">
                      Logout
                    </button>
                  </div>
                </div>
              </template>

              <!-- Login Button -->
              <button v-else @click="handleLogin"
                class="px-6 py-2 bg-gradient-to-r from-primary to-blue-500 text-white rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-200">
                Login
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';

const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

const navLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Întrebări', path: '/questions/bank' },
  { name: 'Quizuri', path: '/my-quizzes' }
];

const handleLogin = () => {
  loginWithRedirect({
    appState: { targetUrl: '/dashboard' }
  });
};

const handleLogout = () => {
  logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
};
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors;
}
</style>