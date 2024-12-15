<template>
  <div>
    <h1>Data for {{ dataType }}</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="dataSet && dataSet.point && dataSet.point.length">
      <table>
        <thead>
          <tr>
            <th>Start Time</th>
            <th>End Time</th>
            <th v-for="(value, key) in dataSet.point[0].value[0]" :key="key">
              {{ key }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="point in dataSet.point" :key="point.startTimeNanos">
            <td>{{ formatTime(point.startTimeNanos) }}</td>
            <td>{{ formatTime(point.endTimeNanos) }}</td>
            <td v-for="(value, key) in point.value[0]" :key="key">
              {{ value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>No data available.</div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useFitnessStore } from "@/stores/fitness";

// Get route params and store instance
const route = useRoute();
const dataType = route.params.dataType;
const fitnessStore = useFitnessStore();

// Extract state from store
const dataSet = computed(() => fitnessStore.getDataSetByType(dataType));
const loading = computed(() => fitnessStore.loading);
const error = computed(() => fitnessStore.error);

// Format time from nanoseconds to a readable format
const formatTime = (nanos) => new Date(Number(nanos) / 1_000_000).toLocaleString();

// Fetch data on mount
onMounted(async () => {
  const dataStream = fitnessStore.getDataSourceByType(dataType)?.[0];

  if (!dataStream) {
    console.error("Data source not found for type:", dataType);
    return;
  }

  const dataStreamId = dataStream.dataStreamId;
  const now = Date.now() * 1_000_000; // Current timestamp in nanoseconds
  const epoch = 0; // Unix epoch start time in nanoseconds

  // Fetch all data entries from the beginning of time to now
  await fitnessStore.fetchDataSet(dataStreamId, epoch, now, dataType);
});
</script>

<style></style>
