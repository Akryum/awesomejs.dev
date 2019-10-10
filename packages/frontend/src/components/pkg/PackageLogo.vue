<template>
  <div class="w-10 h-10 flex items-center justify-center">
    <img
      :src="src || pkg.defaultLogo || genericLogo"
      :alt="`${pkg.name} logo`"
      class="max-w-full max-h-full rounded overflow-hidden"
      @error="onError()"
    >
  </div>
</template>

<script>
export default {
  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      src: null,
    }
  },

  watch: {
    'pkg.id': {
      handler: 'updateLogo',
      immediate: true,
    },
  },

  created () {
    this.genericLogo = require('@/assets/package.png')
  },

  methods: {
    updateLogo () {
      const id = this.pkg.id
      const img = new Image()
      img.onload = () => {
        if (id !== this.pkg.id) return
        this.src = img.src
      }
      img.src = `https://unpkg.com/${this.pkg.name}/logo.png`
    },

    onError () {
      this.src = this.genericLogo
    },
  },
}
</script>
