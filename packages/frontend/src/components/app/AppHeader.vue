<template>
  <header>
    <div class="flex px-4 my-4 lg:px-16 lg:my-8 relative">
      <AppHeaderLogo class="flex-none" />

      <div class="flex-1" />

      <PackageAddButton
        class="mr-4"
      />
      <UserMenu />

      <div
        v-if="!$responsive.sm"
        class="absolute top-0 left-0 w-full pointer-events-none flex justify-center"
      >
        <BaseButton
          icon-left="search"
          class="px-4 py-1 text-gray-600 hover:text-gray-500 pointer-events-auto"
          @click="openSearch = true"
        >
          Search...
        </BaseButton>
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
  </header>
</template>

<script>
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

  data () {
    return {
      openSearch: false,
    }
  },
}
</script>
