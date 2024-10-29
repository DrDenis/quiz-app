<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div
      class="bg-white dark:bg-dark-card max-w-xl w-full mx-4 rounded-xl shadow-lg border border-gray-100 dark:border-dark-border">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 dark:border-dark-border">
        <slot name="header">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Modal Title
          </h3>
        </slot>
      </div>

      <!-- Content -->
      <div class="p-6">
        <slot></slot>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-gray-100 dark:border-dark-border">
        <slot name="footer">
          <div class="flex justify-end space-x-3">
            <button @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
              Închide
            </button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseModal',
  emits: ['close']
}
</script>

<style scoped>
.fixed {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>