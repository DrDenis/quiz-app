<template>
  <div class="min-h-screen bg-white">
    <NavBar />
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {

  a {
    
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
      font-weight: bold;
    }
  }
}
</style>

<script setup>
import NavBar from '@/components/NavBar.vue'
</script>