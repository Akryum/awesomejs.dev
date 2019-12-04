<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <BaseButton
    v-bind="$attrs"
    class="tab px-8 pt-4 pb-3 border-transparent border-b-2 hover:bg-purple-900"
  >
    <slot />
  </BaseButton>
</template>

<style lang="postcss" scoped>
.tab.router-link-active {
  @apply border-purple-500 rounded-b-none text-purple-300;
}
</style>
