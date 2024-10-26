<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg max-w-md w-full mx-4">
      <!-- Header -->
      <div class="p-4 border-b">
        <slot name="header">
          <h3 class="text-lg font-medium text-gray-900">
            Modal Title
          </h3>
        </slot>
      </div>

      <!-- Content -->
      <div class="p-4">
        <slot></slot>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t">
        <slot name="footer">
          <div class="flex justify-end space-x-3">
            <button 
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
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