<template>
  <header
    class="flex px-16 my-8"
  >
    <AppHeaderLogo />

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
