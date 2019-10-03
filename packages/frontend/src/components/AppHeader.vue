<template>
  <header
    class="flex px-16 my-8"
  >
    <AppHeaderLogo />

    <div class="flex-1" />

    <UserMenu />
  </header>
</template>

<script>
import AppHeaderLogo from './AppHeaderLogo.vue'
import UserMenu from './user/UserMenu.vue'

export default {
  components: {
    AppHeaderLogo,
    UserMenu,
  },
}
</script>
