<template>
  <div
    class="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-dark-bg dark:text-dark-text antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
    <NavBar />
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {

  a {

    color: #2c3e50;

    &.router-link-exact-active {
      color: #699D4C;
      font-weight: bold;
    }
  }
}
</style>

<script setup>
import NavBar from '@/components/NavBar.vue'
</script>