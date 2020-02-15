<script>
import AppHeader from './app/AppHeader.vue'
import AppFooter from './app/AppFooter.vue'
import AppGlobalLoading from './app/AppGlobalLoading.vue'
import AppServiceWorkerManager from './app/AppServiceWorkerManager.vue'
import PackageInstallationManager from './pkg/PackageInstallationManager.vue'
import { watch, ref } from '@vue/composition-api'
import { useResponsive } from '@/util/responsive'
import { computeDepthWeight } from '@/util/router'

const title = 'Awesome JS'

export default {
  components: {
    AppHeader,
    AppFooter,
    AppGlobalLoading,
    AppServiceWorkerManager,
    PackageInstallationManager,
  },

  setup (props, { root }) {
    const transitionName = ref()

    const { mobile } = useResponsive()

    // Mobile page transition
    watch(() => root.$route, (value, oldValue) => {
      if (!mobile.value) {
        transitionName.value = null
      } else {
        const newDepthWeight = computeDepthWeight(value)
        const oldDepthWeight = computeDepthWeight(oldValue)
        if (newDepthWeight < oldDepthWeight) {
          transitionName.value = 'page-zoom-parent'
        } else if (newDepthWeight > oldDepthWeight) {
          transitionName.value = 'page-zoom-child'
        } else {
          transitionName.value = null
        }
      }
    }, { lazy: true, flush: 'pre' })
    const transitionIsActive = ref(false)
    watch(transitionIsActive, value => {
      if (value) {
        document.body.classList.add('overflow-hidden', 'absolute', 'w-screen', 'h-screen')
        document.documentElement.classList.add('overflow-hidden')
      } else {
        document.body.classList.remove('overflow-hidden', 'absolute', 'w-screen', 'h-screen')
        document.documentElement.classList.remove('overflow-hidden')
      }
    })

    return {
      transitionName,
      transitionIsActive,
    }
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

    <transition
      :name="transitionName"
      @before-enter="transitionIsActive = true"
      @after-enter="transitionIsActive = false"
    >
      <div :key="transitionName ? $route.fullPath : 'static'">
        <AppHeader />

        <div class="main-view px-4 my-4 lg:px-16 lg:my-8">
          <router-view />
        </div>

        <AppFooter />
      </div>
    </transition>

    <AppServiceWorkerManager />
    <PackageInstallationManager />
  </div>
</template>

<style lang="postcss">
@import '~@/assets/styles/tailwind.postcss';

.main-view {
  min-height: calc(100vh - 280px);
}
</style>
