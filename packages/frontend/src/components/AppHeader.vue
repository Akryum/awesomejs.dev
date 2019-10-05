<template>
  <header
    class="flex px-4 my-4 lg:px-16 lg:my-8"
  >
    <AppHeaderLogo class="flex-none" />

    <div class="flex-1" />

    <PackageAddButton
      class="mr-4"
    />
    <UserMenu />
  </header>
</template>

<script>
import AppHeaderLogo from './AppHeaderLogo.vue'
import PackageAddButton from './pkg/PackageAddButton.vue'
import UserMenu from './user/UserMenu.vue'

export default {
  components: {
    AppHeaderLogo,
    PackageAddButton,
    UserMenu,
  },
}
</script>
