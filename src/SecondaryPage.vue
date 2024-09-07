<template>
  <div class="dark:bg-gray-900 py-2">
    <div class="p-5 w-11/12 antialiased mx-auto">
      <ToastList />
      <ToggleLightDarkMode />
      <SecondaryComp />
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import SecondaryComp from './components/partial/SecondaryComp.vue';
import ToggleLightDarkMode from './components/elements/ToggleLightDarkMode.vue';
import ToastList from './components/partial/ToastList.vue';
import Footer from './components/elements/Footer.vue';
import './assets/index.css';

export default {
  name: 'App',
  components: {
    SecondaryComp,
    ToggleLightDarkMode,
    ToastList,
    // Footer
  }
}
</script>

<style>
body {
  font-family: "Figtree", sans-serif;
}
</style>
