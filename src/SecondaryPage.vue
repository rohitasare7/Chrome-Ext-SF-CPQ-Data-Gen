<template>
  <div class="dark:bg-gray-900 py-2">
    <div class="p-5 w-11/12 antialiased mx-auto">
      <ToggleLightDarkMode />
      <SecondaryComp />
    </div>
  </div>
</template>

<script>
import SecondaryComp from './components/partial/SecondaryComp.vue';
import ToggleLightDarkMode from './components/elements/ToggleLightDarkMode.vue'
import './assets/index.css';

export default {
  name: 'App',
  components: {
    SecondaryComp,
    ToggleLightDarkMode
  }
}
</script>

<style>
body {
  font-family: "Figtree", sans-serif;
}
</style>
