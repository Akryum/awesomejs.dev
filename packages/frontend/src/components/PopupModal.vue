<template>
  <transition
    name="zoom"
    appear
  >
    <FocusTrap active>
      <div
        class="overlay fixed z-20 inset-0 flex flex-col items-center bg-blur p-4 sm:p-24"
        :class="{
          'justify-start': size === 'full',
          'justify-center': size === 'small',
        }"
        @keyup.esc="close()"
      >
        <div
          class="absolute inset-0 bg-gray-900 opacity-90"
          @click="close()"
        />

        <div
          class="zoomable relative bg-gray-800 shadow-lg rounded p-4 sm:p-8 sm:pt-4 overflow-auto box"
          :class="{
            'flex-1 w-full max-w-6xl max-h-screen': size === 'full',
            'flex-none w-full max-w-2xl max-h-2xl': size === 'small',
          }"
        >
          <div class="flex items-center mb-2 sm:mb-4 lg:mb-0">
            <div class="text-gray-600 flex-1 truncate">
              <slot name="title" />
            </div>

            <BaseButton
              icon-left="close"
              class="px-4 -mr-4 py-1 text-gray-600 hover:text-gray-500"
              @click="close()"
            >
              Close
            </BaseButton>
          </div>

          <slot />
        </div>
      </div>
    </FocusTrap>
  </transition>
</template>

<script>
import { FocusTrap } from 'focus-trap-vue'

export default {
  components: {
    FocusTrap,
  },

  props: {
    size: {
      type: String,
      default: 'full',
    },
  },

  methods: {
    close () {
      this.$emit('close')
    },
  },
}
</script>
