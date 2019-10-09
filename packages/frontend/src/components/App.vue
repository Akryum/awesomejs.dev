<template>
  <div id="app">
    <AppHeader />

    <div class="main-view px-4 my-4 lg:px-16 lg:my-8">
      <router-view />
    </div>

    <AppFooter />

    <AppServiceWorkerManager />
  </div>
</template>

<script>
import AppHeader from './app/AppHeader.vue'
import AppFooter from './app/AppFooter.vue'
import AppServiceWorkerManager from './app/AppServiceWorkerManager.vue'

export default {
  components: {
    AppHeader,
    AppFooter,
    AppServiceWorkerManager,
  },
}
</script>

<style lang="postcss">
@import '~@/assets/styles/tailwind.postcss';

.main-view {
  min-height: calc(100vh - 280px);
}
</style>
