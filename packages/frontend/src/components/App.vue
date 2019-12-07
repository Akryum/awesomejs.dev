<script>
import AppHeader from './app/AppHeader.vue'
import AppFooter from './app/AppFooter.vue'
import AppGlobalLoading from './app/AppGlobalLoading.vue'
import AppServiceWorkerManager from './app/AppServiceWorkerManager.vue'

const title = 'Awesome JS'

export default {
  components: {
    AppHeader,
    AppFooter,
    AppGlobalLoading,
    AppServiceWorkerManager,
  },

  metaInfo: {
    title,
    titleTemplate: t => t === title ? t : `${t} - ${title}`,
    meta: [
      {
        property: 'og:title',
        content: 'Awesome JS Packages',
        vmid: 'og:title',
      },
      {
        property: 'og:description',
        content: 'Find awesome package for your actual project',
        vmid: 'og:description',
      },
      {
        property: 'og:image',
        content: `${process.env.BASE_URL}thumbnail.png`,
        vmid: 'og:image',
      },
    ],
  },
}
</script>

<template>
  <div id="app">
    <AppGlobalLoading />

    <AppHeader />

    <div class="main-view px-4 my-4 lg:px-16 lg:my-8">
      <router-view />
    </div>

    <AppFooter />

    <AppServiceWorkerManager />
  </div>
</template>

<style lang="postcss">
@import '~@/assets/styles/tailwind.postcss';

.main-view {
  min-height: calc(100vh - 280px);
}
</style>
