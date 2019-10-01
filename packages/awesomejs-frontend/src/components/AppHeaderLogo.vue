<template>
  <img
    :src="src"
    class="w-8 h-8 bg-gray-700 rounded-full"
    alt="Logo"
  >
</template>

<script>
export default {
  computed: {
    src () {
      return require('@/assets/logo.png')
    },
  },
}
</script>
