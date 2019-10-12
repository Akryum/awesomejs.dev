<template>
  <h1
    class="flex items-center"
    :class="{
      'justify-center': center,
    }"
  >
    <div
      class="flex-none flex items-center"
      :class="{
        'justify-center': center,
        'mr-1 lg:mr-4': !center,
      }"
    >
      <router-link
        v-if="backTo"
        :to="backTo"
        class="mr-2 lg:mr-4 text-gray-600 hover:text-gray-500 h-6"
      >
        <i class="material-icons text-xl lg:text-2xl">arrow_back</i>
      </router-link>

      <span class="text-gray-500 text-xl lg:text-2xl leading-snug">
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
