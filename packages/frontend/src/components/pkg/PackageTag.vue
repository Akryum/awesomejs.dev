<script>
export default {
  inheritAttrs: false,

  props: {
    tag: {
      type: String,
      required: true,
    },

    selected: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <BaseButton
    v-bind="$attrs"
    class="mr-2 px-2 text-gray-500 bg-gray-800 hover:bg-gray-700 rounded mb-2 flex-none xl:mb-0"
    :class="{
      'text-orange-400 bg-yellow-900 hover:bg-yellow-800': tag === 'official',
      'text-blue-400 bg-blue-900 hover:bg-blue-800': tag.startsWith('version:'),
      'text-purple-300 bg-purple-800 hover:bg-purple-700': selected,
    }"
    v-on="$listeners"
  >
    <template v-if="tag.startsWith('version:')">
      <span>version<span class="opacity-50">:</span></span>
      <span class="font-bold">{{ tag.substr('version:'.length) }}</span>
    </template>
    <template v-else>
      {{ tag }}
    </template>
  </BaseButton>
</template>
