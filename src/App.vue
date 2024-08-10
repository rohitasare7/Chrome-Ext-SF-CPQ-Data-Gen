<template>
  <div class="p-5 dark:bg-gray-900 antialiased" style="max-width: 700px; min-width: 600px;">
    <AppIndex />
  </div>
</template>

<script>
import AppIndex from './components/AppIndex.vue'
import './assets/index.css';

export default {
  name: 'App',
  components: {
    AppIndex
  }
}
</script>

<style>
body {
  font-family: "Figtree", sans-serif;
}
</style>
