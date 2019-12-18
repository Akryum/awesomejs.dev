<script>
import { ref } from '@vue/composition-api'
import { isMac } from '@/util/env'
import AppHeaderLogo from './AppHeaderLogo.vue'
import PackageAddButton from '../pkg/PackageAddButton.vue'
import UserMenu from '../user/UserMenu.vue'
import SearchOverlayAsyncState from '../search/SearchOverlayAsyncState.vue'
const SearchOverlayLoading = {
  render: h => h(SearchOverlayAsyncState, { props: { state: 'loading' } }),
}
const SearchOverlayError = {
  render (h) {
    return h(SearchOverlayAsyncState, { props: { state: 'error' }, on: this.$listeners })
  },
}
const SearchOverlay = () => ({
  component: import(
    /* webpackChunkName: "SearchOverlay.vue" */
    '../search/SearchOverlay.vue'
  ),
  // A component to use while the async component is loading
  loading: SearchOverlayLoading,
  // A component to use if the load fails
  error: SearchOverlayError,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000,
})

export default {
  components: {
    AppHeaderLogo,
    PackageAddButton,
    SearchOverlay,
    UserMenu,
  },

  setup () {
    const openSearch = ref(false)
    return {
      openSearch,
      isMac,
    }
  },
}
</script>

<template>
  <header>
    <div class="flex items-center px-4 pt-4 pb-0 lg:px-16 lg:pt-0 lg:my-8 relative">
      <AppHeaderLogo class="flex-none" />

      <div class="flex-1" />

      <PackageAddButton
        class="mr-4"
      />
      <UserMenu />

      <div
        v-if="!$responsive.sm"
        class="absolute top-0 left-0 w-full h-0 flex justify-center"
      >
        <div>
          <BaseButton
            v-tooltip="`Search packages <span class='text-gray-500 font-mono'>${isMac ? '⌘' : 'Ctrl'}+F</span>`"
            icon-left="search"
            class="px-4 py-2 text-gray-500 hover:text-gray-400 hover:bg-gray-800"
            @click="openSearch = true"
          >
            Search...
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- FAB -->
    <div
      v-if="$responsive.sm"
      class="fixed bottom-0 right-0 p-8 z-20"
    >
      <BaseButton
        class="p-3 bg-yellow-500 rounded-full shadow-xl text-black"
        @click="openSearch = true"
      >
        <i class="material-icons">search</i>
      </BaseButton>
    </div>

    <transition name="fade">
      <keep-alive include="SearchOverlay">
        <SearchOverlay
          v-if="openSearch"
          @close="openSearch = false"
        />
      </keep-alive>
    </transition>

    <GlobalEvents
      @keydown.ctrl.70.prevent="openSearch = !openSearch"
    />
  </header>
</template>
