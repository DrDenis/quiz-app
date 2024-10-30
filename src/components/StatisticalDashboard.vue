<template>
  <div class="space-y-6">
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard v-for="(stat, index) in statsOverview" :key="index" :title="stat.title" :value="stat.value"
        :icon="stat.icon" :color="stat.color" />
    </div>

    <!-- Questions Analysis -->
    <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Analiza Întrebărilor
      </h2>

      <div class="space-y-6">
        <div v-for="(question, index) in quiz.questions" :key="question._id"
          class="border-b border-gray-100 dark:border-dark-border pb-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="font-medium text-gray-900 dark:text-white">
              {{ index + 1 }}. {{ question.text }}
            </h3>
            <div class="flex items-center gap-2">
              <select v-model="question.statisticalData.chartType"
                class="text-sm border border-gray-300 dark:border-dark-border rounded-lg">
                <option value="pie">Pie Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </div>
          </div>

          <!-- Chart Component -->
          <div class="h-64">
            <component :is="chartComponents[question.statisticalData.chartType]"
              :data="statistics.questionStats[question._id]" :options="chartOptions" />
          </div>

          <!-- Demographic Filters -->
          <div v-if="quiz.settings.statistical.collectDemographics" class="mt-4">
            <div class="flex gap-2">
              <select v-model="demographicFilter"
                class="text-sm border border-gray-300 dark:border-dark-border rounded-lg">
                <option value="">Toate demografiile</option>
                <option v-for="field in quiz.settings.statistical.demographicFields" :key="field.name"
                  :value="field.name">
                  {{ field.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Demographic Analysis -->
    <div v-if="quiz.settings.statistical.collectDemographics"
      class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Analiza Demografică
      </h2>
      <!-- Demographic visualizations -->
    </div>

    <!-- Time Trends -->
    <div class="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Tendințe în Timp
      </h2>
      <div class="space-y-4">
        <div class="flex gap-4">
          <button v-for="period in periods" :key="period" @click="selectedTimePeriod = period" :class="[
            'px-4 py-2 rounded-lg',
            selectedTimePeriod === period
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          ]">
            {{ period }}
          </button>
        </div>

        <!-- Trend Chart -->
        <div class="h-80">
          <LineChart :data="getTrendChartData()" :options="trendOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import StatsCard from './StatsCard.vue'
import { LineChart, BarChart, PieChart } from 'vue-chartjs'

defineProps({
  quiz: {
    type: Object,
    required: true
  },
  statistics: {
    type: Object,
    required: true
  },
  statsOverview: {
    type: Array,
    required: true
  }
})

const chartComponents = {
  line: LineChart,
  bar: BarChart,
  pie: PieChart
}

const demographicFilter = ref('')
const selectedTimePeriod = ref('7d')
const periods = ['7d', '30d', '90d', '1y']

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const trendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const getTrendChartData = () => {
  // Implementation for getting trend chart data based on selectedTimePeriod
  return {
    labels: [],
    datasets: []
  }
}
</script>