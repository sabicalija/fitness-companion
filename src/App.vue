<template>
  <div>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <li><router-link to="/weight">Weight</router-link></li>
        <li>
          <button @click="toggleDarkMode">{{ isDark ? "Light" : "Dark" }} Mode</button>
        </li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useDark } from "@vueuse/core";

const isDark = useDark();

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
};
</script>

<style>
nav ul {
  list-style-type: none;
  padding: 0;
}

nav ul li {
  display: inline;
  margin-right: 10px;
}
</style>
