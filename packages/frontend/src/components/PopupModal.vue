<template>
  <transition
    name="zoom"
    appear
  >
    <FocusTrap active>
      <div
        class="overlay fixed z-10 inset-0 flex flex-col items-center justify-start bg-blur p-4 sm:p-24 "
        @keyup.esc="close()"
      >
        <div
          class="absolute inset-0 bg-gray-900 opacity-90"
          @click="close()"
        />

        <div
          class="zoomable relative bg-gray-800 shadow-lg rounded p-4 sm:p-8 sm:pt-4 flex-1 w-full max-w-6xl max-h-screen overflow-auto box"
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

  methods: {
    close () {
      this.$emit('close')
    },
  },
}
</script>
