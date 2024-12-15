<template>
  <div class="login">
    <h1>Welcome to Fitness Companion</h1>
    <p>Track your fitness data seamlessly.</p>
    <button @click="handleLogin">Login with Google</button>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const handleLogin = () => {
  authStore.login();
};
</script>
