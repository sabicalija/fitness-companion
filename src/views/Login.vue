<template>
  <div class="login">
    <h1>Welcome to Fitness Companion</h1>
    <button @click="login">Login with Google</button>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useGoogleOAuth } from "@/composables/useGoogleOAuth";

const authStore = useAuthStore();
const { getAuthUrl, exchangeCodeForToken } = useGoogleOAuth(import.meta.env.VITE_CLIENT_ID);

const login = () => {
  const authUrl = getAuthUrl(import.meta.env.VITE_REDIRECT_URI, [
    "https://www.googleapis.com/auth/fitness.activity.read",
    "https://www.googleapis.com/auth/fitness.blood_glucose.read",
    "https://www.googleapis.com/auth/fitness.blood_pressure.read",
    "https://www.googleapis.com/auth/fitness.body.read",
    "https://www.googleapis.com/auth/fitness.heart_rate.read",
    "https://www.googleapis.com/auth/fitness.body_temperature.read",
    "https://www.googleapis.com/auth/fitness.location.read",
    "https://www.googleapis.com/auth/fitness.nutrition.read",
    "https://www.googleapis.com/auth/fitness.oxygen_saturation.read",
    "https://www.googleapis.com/auth/fitness.reproductive_health.read",
    "https://www.googleapis.com/auth/fitness.sleep.read",
  ]);
  window.location.href = authUrl;
};
</script>
