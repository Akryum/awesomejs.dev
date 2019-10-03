<template>
  <div id="app">
    <AppHeader />

    <div class="px-16 my-8">
      <router-view />
    </div>

    <footer
      class="text-center text-gray-800 px-8 py-16"
    >
      <div>
        <span>Some icons from <a
          href="https://icons8.com"
          target="_blank"
        >icons8</a></span>
      </div>
    </footer>
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
