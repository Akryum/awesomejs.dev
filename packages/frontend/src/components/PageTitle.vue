<template>
  <h1 class="text-gray-500 text-lg lg:text-2xl flex">
    <router-link
      v-if="backTo"
      :to="backTo"
      class="mr-4 text-gray-600 hover:text-gray-500 text-xl lg:text-2xl"
    >
      <i class="material-icons">arrow_back</i>
    </router-link>

    <slot />
  </h1>
</template>

<script>
export default {
  props: {
    backTo: {
      type: [String, Object],
      default: null,
    },
  },
}
</script>
