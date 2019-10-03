<template>
  <div id="app">
    <AppHeader />

    <div class="px-16 my-8">
      <router-view />
    </div>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  components: {
    AppHeader,
    AppFooter,
  },
}
</script>

<style lang="postcss">
@import 'assets/styles/tailwind.postcss';
</style>
