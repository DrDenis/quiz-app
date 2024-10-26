<!-- src/components/NavBar.vue -->
<template>
  <nav class=" backdrop-blur-sm shadow isolate bg-white/20 shadow-lg ring-1 ring-black/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between align-middle h-20">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-gray-800">
            Quiz App
          </router-link>
        </div>
        <div class="flex items-center gap-4">
          <!-- Skeleton loader când se încarcă -->
          <div v-if="isLoading" class="flex items-center gap-4">
            <div class="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div class="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          </div>

          <!-- Conținut după ce s-a încărcat -->
          <template v-else>
            <template v-if="isAuthenticated">
              <div class="flex gap-4">
                <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
              <router-link to="/questions" class="nav-link">Întrebări</router-link>
              <router-link to="/my-quizzes" class="nav-link">Quizuri</router-link>
              </div>
              
              <div class="group inline-block relative">
                <button class="inline-flex items-center">
                  <span class="mr-1"> 
                    <span class="text-sm text-gray-600 flex items-end gap-1 nav-link">
                        <!-- SVG user icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"/>
                        </svg>
                        
                        <!-- Display user's first name -->
                        {{ user.given_name }}
                      </span>
                    </span>
                  <svg
                    class="fill-current h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                  </svg>
                </button>
        <ul class="overflow-hidden absolute hidden text-gray-700 pt-0  group-hover:block w-[100%] bg-white shadow-lg ">
          <li class=" p-2 block hover:bg-slate-100 transition-colors bottom-1 border-b-[1px]">Cont</li>
          <li class=" p-2 hover:bg-slate-100 transition-colors">
            <button @click="handleLogout"
                class="">
                Logout
              </button>
          </li>
          
        </ul>
      </div>
            </template>
            <button v-else @click="handleLogin"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Login
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';

const {
  loginWithRedirect,
  logout,
  user,
  isAuthenticated,
  isLoading
} = useAuth0();

const handleLogin = () => {
  loginWithRedirect({
    appState: { targetUrl: '/admin' }
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