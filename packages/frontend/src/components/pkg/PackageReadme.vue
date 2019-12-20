<script>
import LoadingIndicator from '../LoadingIndicator.vue'

import Vue from 'vue'
import gql from 'graphql-tag'
import { ref, watch } from '@vue/composition-api'
import { useQuery, useResult } from '@vue/apollo-composable'

const GOOGLE_IMG_PROXY = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url='

export default {
  components: {
    LoadingIndicator,
  },

  props: {
    packageId: {
      type: String,
      required: true,
    },

    query: {
      type: Object,
      default: null,
    },
  },

  setup (props, { root }) {
    // Pkg
    const { result, loading } = useQuery(() => props.query || gql`
      query PackageReadme ($id: ID!) {
        pkg: package (id: $id) {
          id
          readme
        }
      }
    `, () => ({
      id: props.packageId,
    }))
    const pkg = useResult(result, {})

    // Processing
    const render = ref()
    async function processRender () {
      await Vue.nextTick()

      // Images
      const imgs = render.value.querySelectorAll('img')
      for (const el of imgs) {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = () => onImgLoad(img, el)
        img.src = `${GOOGLE_IMG_PROXY}${el.src}`
      }
    }

    function onImgLoad (img, el) {
      // Empty
      if (img.width <= 1 || img.height <= 1) return

      // Badges
      if (img.height === 20) return

      // Calculate brightness
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      let r, g, b, avg
      let colorSum = 0

      for (let x = 0, len = data.length; x < len; x += 4) {
        r = data[x]
        g = data[x + 1]
        b = data[x + 2]

        avg = Math.floor((r + g + b) / 3)
        colorSum += avg
      }

      const brightness = Math.floor(colorSum / (img.width * img.height))
      if (brightness < 60) {
        el.classList.add('ally-bg')

        if (img.width === img.height && img.width <= 64) {
          el.classList.add('avatar')
        }
      }
    }

    watch(() => pkg.value.readme, () => processRender(), {
      lazy: true,
    })

    return {
      pkg,
      loading,
      render,
    }
  },
}
</script>

<template>
  <LoadingIndicator
    v-if="loading"
    class="p-8"
  />
  <div
    v-else
    class="readme pb-8 mt-4 border-t-2 border-gray-800"
  >
    <div
      ref="render"
      class="markdown pt-8 pb-64"
      v-html="pkg.readme"
    />
  </div>
</template>
