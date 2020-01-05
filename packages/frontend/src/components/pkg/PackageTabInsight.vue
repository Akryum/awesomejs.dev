<script>
export default {
  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <router-view :pkg="pkg" />
</template>
