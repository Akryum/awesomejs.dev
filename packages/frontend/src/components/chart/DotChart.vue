<script>
import { scaleLinear, extent } from 'd3'
import { computed, watch, ref } from '@vue/composition-api'

import LoadingIndicator from '../LoadingIndicator.vue'

export default {
  components: {
    LoadingIndicator,
  },

  props: {
    points: {
      type: Array,
      required: true,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      default: null,
    },
  },

  setup (props) {
    const values = computed(() => props.points.map(pt => pt.value))
    const scale = computed(() => scaleLinear()
      // @ts-ignore
      .domain(extent(values.value))
      .range([0, 100]),
    )

    const graph = ref(null)

    // Auto scroll
    function scrollToRight () {
      if (graph.value) {
        graph.value.scrollLeft = graph.value.scrollWidth
      }
    }
    watch(values, () => {
      scrollToRight()
    })
    watch(graph, () => {
      scrollToRight()
    })

    return {
      scale,
      graph,
    }
  },
}
</script>

<template>
  <div class="border-blue-900 border-2 rounded p-4 mb-4">
    <!-- Header -->
    <div>
      <h3 class="text-blue-400">
        <i
          v-if="icon"
          class="material-icons text-xl mr-2 text-blue-600"
        >{{ icon }}</i>
        {{ title }}
      </h3>
    </div>

    <div
      v-if="loading"
      class="pt-8 pb-4"
    >
      <LoadingIndicator
        class="h-32 text-blue-500"
      />
      <div class="h-5" />
    </div>

    <!-- Graph -->
    <div
      v-else
      ref="graph"
      class="flex overflow-x-auto"
    >
      <div
        v-for="(point, index) of points"
        :key="index"
        v-tooltip="{ content: point.tooltip, placement: 'bottom', delay: { show: 0, hide: 0 } }"
        class="group flex-1 pt-8"
      >
        <div class="w-2 px-2 h-32 relative">
          <div
            class="absolute bottom-0 w-2 rounded bg-blue-800 group-hover:bg-blue-700"
            :style="{
              height: `calc(${scale(point.value)}% + 4px)`,
            }"
          />
          <div
            class="absolute w-2 h-2 rounded-full bg-blue-500 group-hover:bg-blue-400"
            :style="{
              bottom: `${scale(point.value)}%`,
            }"
          />
        </div>

        <!-- Label -->
        <div
          v-if="(index - 2) % 5 === 0"
          class="w-2 px-2 h-5 mt-4"
        >
          <div class="relative -ml-8 w-16 text-center text-xs text-gray-600 group-hover:text-gray-500">
            {{ point.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
