<template>
  <div class="flex text-purple-500">
    <div class="mr-1">
      {{ count }}
    </div>
    <i class="material-icons">star</i>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      required: true,
    },
  },
}
</script>
