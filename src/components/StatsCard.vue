<template>
  <div class="bg-white  rounded-xl shadow-sm p-6 border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
      <span :class="`p-2 bg-${color}-50 rounded-lg`">
        <svg class="w-5 h-5" :class="`text-${color}-500`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
        </svg>
      </span>
    </div>
    <p class="text-2xl font-semibold text-gray-900">{{ value }}</p>
    <p class="text-sm text-gray-500 mt-2">
      <slot></slot>
    </p>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  color: {
    type: String,
    default: 'blue'
  },
  icon: {
    type: String,
    required: true
  }
})
</script>