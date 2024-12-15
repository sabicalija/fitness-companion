<template>
  <div class="dashboard">
    <h1>Data Types</h1>
    <ul>
      <li v-for="dataType in dataTypes" :key="dataType">
        <router-link :to="`/dashboard/${dataType}`">{{ formatDataType(dataType) }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useFitnessStore } from "@/stores/fitness";

const authStore = useAuthStore();
const fitnessStore = useFitnessStore();
const route = useRoute();

const dataTypes = computed(() => [...new Set(fitnessStore.dataSources.map((source) => source.dataType.name))]);

const formatDataType = (dataType) => {
  return dataType.split(".").pop().replace("_", " ").toUpperCase();
};

onMounted(async () => {
  const authCode = route.query.code;

  // Fetch access token if needed
  if (authCode) {
    await authStore.fetchAccessToken(authCode);
  }

  // Fetch data sources if access token is available and data sources are not already loaded
  if (authStore.accessToken && !fitnessStore.dataSources.length) {
    await fitnessStore.fetchDataSources();
  }
});
</script>

<style scoped>
.error {
  color: red;
  margin-top: 1rem;
}
</style>
