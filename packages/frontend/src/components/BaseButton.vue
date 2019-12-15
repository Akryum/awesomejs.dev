<script>
import SubmitAnimation from './SubmitAnimation.vue'
import { computed } from '@vue/composition-api'

export default {
  components: {
    SubmitAnimation,
    CustomRouterLink: {
      functional: true,
      render (h, { data, children, listeners }) {
        if (listeners['!click']) {
          data.nativeOn = data.nativeOn || {}
          data.nativeOn['!click'] = listeners['!click']
        }
        return h('router-link', data, children)
      },
    },
  },

  inheritAttrs: false,

  props: {
    iconLeft: {
      type: String,
      default: null,
    },

    iconRight: {
      type: String,
      default: null,
    },

    type: {
      type: String,
      default: 'button',
    },

    loading: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    align: {
      type: String,
      default: 'center',
    },
  },

  setup (props, { attrs, emit }) {
    const component = computed(() => {
      if (attrs.to) {
        return 'CustomRouterLink'
      } else if (attrs.href) {
        return 'a'
      } else {
        return 'button'
      }
    })

    const ghost = computed(() => props.disabled || props.loading)

    function handleClick (event) {
      if (ghost.value) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
      } else {
        emit('click', event)
      }
    }

    return {
      component,
      ghost,
      handleClick,
    }
  },
}
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    :type="type"
    :tabindex="ghost ? -1 : 0"
    role="button"
    :aria-disabled="ghost"
    class="inline-block cursor-pointer relative rounded select-none outline-none"
    :class="{
      'pointer-events-none opacity-50': ghost,
      'text-center': align === 'center',
    }"
    @click.capture="handleClick"
  >
    <div
      class="flex items-center rounded"
      :class="{
        'opacity-0': loading,
        'justify-center': align === 'center',
      }"
    >
      <i
        v-if="iconLeft"
        class="material-icons text-lg mr-2"
      >{{ iconLeft }}</i>
      <slot />
      <i
        v-if="iconRight"
        class="material-icons text-lg ml-2"
      >{{ iconRight }}</i>
    </div>

    <SubmitAnimation
      v-if="loading"
      class="absolute inset-0"
    />
  </component>
</template>
