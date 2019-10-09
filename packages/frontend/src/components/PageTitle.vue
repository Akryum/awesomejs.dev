<template>
  <h1
    class="flex flex-col xl:flex-row"
    :class="{
      'items-center justify-center': center,
      'items-baseline': !center,
    }"
  >
    <div
      class="flex-none flex"
      :class="{
        'justify-center': center,
        'mr-4': !center,
      }"
    >
      <router-link
        v-if="backTo"
        :to="backTo"
        class="mr-4 text-gray-600 hover:text-gray-500 text-xl lg:text-2xl"
      >
        <i class="material-icons">arrow_back</i>
      </router-link>

      <span class="text-gray-500 text-lg lg:text-2xl">
        <slot />
      </span>
    </div>

    <slot name="after" />
  </h1>
</template>

<script>
export default {
  props: {
    backTo: {
      type: [String, Object],
      default: null,
    },

    center: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
