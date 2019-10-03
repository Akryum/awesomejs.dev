<template>
  <div id="app">
    <AppHeader />

    <div class="px-16 my-8">
      <router-view />
    </div>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'

export default {
  components: {
    AppHeader,
  },
}
</script>

<style lang="postcss">
@import 'assets/styles/tailwind.postcss';
</style>
