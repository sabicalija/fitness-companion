<template>
  <div class="dashboard">
    <h1>Fitness Dashboard</h1>
    <button @click="fetchFitnessData">Fetch Fitness Data</button>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <details open v-else-if="fitnessData">
      <summary>Fitness Data</summary>
      <pre>{{ formattedFitnessData }}</pre>
    </details>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const route = useRoute();

const fitnessData = ref(null);
const loading = ref(false);
const error = ref(null);

const formattedFitnessData = computed(() => (fitnessData.value ? JSON.stringify(fitnessData.value, null, 2) : ""));

const fetchFitnessData = async () => {
  const accessToken = authStore.accessToken; // Get token from the store
  if (!accessToken) {
    error.value = "User not authenticated. Please login.";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataSources", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) throw new Error("Failed to fetch fitness data");

    fitnessData.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const authCode = route.query.code;
  if (authCode) {
    authStore.fetchAccessToken(authCode);
  }
});
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  text-align: center;
}

button {
  margin: 1rem 0;
  padding: 10px 20px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #357ae8;
}

.error {
  color: red;
  margin-top: 1rem;
}

pre {
  text-align: left;
  background-color: #f8f8f8;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
}
</style>
