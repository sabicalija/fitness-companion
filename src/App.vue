<template>
  <div id="app" :class="{ dark: isDark }">
    <router-view />
  </div>
</template>

<script setup>
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDarkMode = useToggle(isDark);
</script>
