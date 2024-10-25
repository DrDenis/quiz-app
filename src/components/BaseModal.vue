<!-- src/components/BaseModal.vue -->
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
      <div class="p-4 border-t flex justify-end space-x-2">
        <slot name="footer">
          <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
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