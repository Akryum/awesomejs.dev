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
        class="absolute top-0 left-0 w-full h-0 flex justify-center"
      >
        <BaseButton
          icon-left="search"
          class="px-4 py-1 text-gray-600 hover:text-gray-500"
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

    <SearchOverlay
      v-if="openSearch"
      @close="openSearch = false"
    />
  </header>
</template>

<script>
import AppHeaderLogo from './AppHeaderLogo.vue'
import PackageAddButton from '../pkg/PackageAddButton.vue'
import UserMenu from '../user/UserMenu.vue'
const SearchOverlay = () => import(
  /* webpackChunkName: "SearchOverlay.vue" */
  '../search/SearchOverlay.vue'
)

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
