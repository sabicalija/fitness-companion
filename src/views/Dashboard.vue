<template>
  <div class="dashboard">
    <h1>Fitness Dashboard</h1>
    <div v-if="fitnessStore.loading">Loading...</div>
    <div v-else-if="fitnessStore.error" class="error">{{ fitnessStore.error }}</div>
    <div v-else-if="fitnessStore.dataSources">
      <p>Data Providers</p>
      <ul>
        <li v-for="{ dataStreamId } in fitnessStore.dataSources">{{ dataStreamId }}</li>
      </ul>
    </div>
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

onMounted(async () => {
  const authCode = route.query.code;
  if (authCode) {
    await authStore.fetchAccessToken(authCode);
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
