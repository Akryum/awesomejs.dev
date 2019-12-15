<script>
export default {
  props: {
    dataSource: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <div class="p-4 mb-4 border-2 border-gray-800 rounded">
    <div class="text-xl mb-2">
      {{ dataSource.type }}
    </div>
    <div>
      <div
        v-for="(value, key) in dataSource.data"
        :key="key"
      >
        <span class="text-gray-500 mr-2">{{ key }}:</span>
        <span>{{ value }}</span>
      </div>
    </div>
  </div>
</template>
