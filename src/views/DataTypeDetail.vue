<template>
  <div>
    <h1>Data for {{ dataType }}</h1>
    <div>
      <label for="start-date">Start Date:</label>
      <input type="date" id="start-date" v-model="startDate" @change="fetchData" />
      <label for="end-date">End Date:</label>
      <input type="date" id="end-date" v-model="endDate" @change="fetchData" />
    </div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="dataSet.point.length">
      <table>
        <thead>
          <tr>
            <th>Start Time</th>
            <th>End Time</th>
            <th v-for="(value, key) in dataSet.point[0].value" :key="key">
              {{ key }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(point, index) in dataSet.point" :key="point.startTimeNanos">
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
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useFitnessStore } from "@/stores/fitness";

// Get route params and store instance
const route = useRoute();
const dataType = route.params.dataType;
const fitnessStore = useFitnessStore();

const loading = ref(true);
const error = ref(null);
const dataSet = ref(null);

const today = new Date();
const startDate = ref(new Date(today.setDate(today.getDate() - 100)).toISOString().split("T")[0]);
const endDate = ref(new Date().toISOString().split("T")[0]);

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const dataStream = fitnessStore.getDataSourceByType(dataType)?.[0];

    if (!dataStream) {
      throw new Error("Data source not found for type: " + dataType);
    }

    const dataStreamId = dataStream.dataStreamId;
    const start = new Date(startDate.value).getTime() * 1_000_000; // Start date in nanoseconds
    const end = new Date(endDate.value).getTime() * 1_000_000; // End date in nanoseconds

    const lastFetchStartDate = fitnessStore.getLastFetchStartDateByType(dataType);
    const lastFetchEndDate = fitnessStore.getLastFetchEndDateByType(dataType);

    // Use cache if the date picker hasn't changed since the last fetch
    if (lastFetchStartDate === start && lastFetchEndDate === end) {
      dataSet.value = fitnessStore.getDataSetByType(dataType);
    } else {
      // Fetch data entries between the selected dates
      await fitnessStore.fetchDataSet(dataStreamId, start, end, dataType);
      dataSet.value = fitnessStore.getDataSetByType(dataType);
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const formatTime = (nanoseconds) => {
  const date = new Date(nanoseconds / 1_000_000);
  return date.toLocaleString();
};

onMounted(fetchData);

watch([startDate, endDate], fetchData);
</script>

<style></style>
