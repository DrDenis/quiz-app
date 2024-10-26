<template>
  <div class="flex items-center p-4 bg-gray-50 rounded-lg">
    <span 
      class="w-8 h-8 flex items-center justify-center rounded-lg"
      :class="typeClass"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          :d="icon" 
        />
      </svg>
    </span>
    <div class="ml-4 flex-1">
      <p class="text-sm font-medium text-gray-900">{{ title }}</p>
      <p class="text-sm text-gray-500">{{ time }}</p>
    </div>
    <button 
      v-if="actionLink"
      @click="$router.push(actionLink)"
      class="ml-4 text-sm text-blue-600 hover:text-blue-800"
    >
      Vezi
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps } from "vue";

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  actionLink: {
    type: String,
    default: ''
  }
})

const typeClass = computed(() => {
  const classes = {
    'quiz-created': 'bg-blue-50 text-blue-500',
    'quiz-completed': 'bg-green-50 text-green-500',
    'question-added': 'bg-purple-50 text-purple-500'
  }
  return classes[props.type] || 'bg-gray-50 text-gray-500'
})

const icon = computed(() => {
  const icons = {
    'quiz-created': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    'quiz-completed': 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    'question-added': 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  return icons[props.type] || ''
})
</script>