<script>
import PopupModal from '../PopupModal.vue'
import { ref } from '@vue/composition-api'
import { useQrcode } from '@/util/qrcode'
import { useShare } from '@/util/share'
import { useRouter } from '@/util/router'

export default {
  components: {
    PopupModal,
  },

  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  setup (props, { emit }) {
    function close () {
      emit('close')
    }

    const router = useRouter()
    const url = ref(window.location.origin + router.resolve({
      name: 'package',
      params: {
        packageId: props.pkg.id,
      },
    }).href)

    const input = ref(null)

    function selectAll () {
      input.value.setSelectionRange(0, input.value.value.length)
    }

    const copied = ref(false)

    async function copy () {
      await navigator.clipboard.writeText(url.value)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }

    const qrcode = useQrcode(url)

    const share = useShare(() => ({
      title: props.pkg.name,
      text: `${props.pkg.name} - ${props.pkg.description}`,
      url: url.value,
    }))

    return {
      close,
      url,
      input,
      selectAll,
      copy,
      copied,
      qrcode,
      share,
    }
  },
}
</script>

<template>
  <PopupModal
    size="small"
    @close="close()"
  >
    <template #title>
      Share {{ pkg.name }}
    </template>

    <div
      v-if="share"
      class="my-8 flex"
    >
      <BaseButton
        icon-left="share"
        class="w-full px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-yellow-900"
        @click="share()"
      >
        Share
      </BaseButton>
    </div>

    <div class="my-8 flex">
      <input
        ref="input"
        :value="url"
        readonly
        class="bg-black px-8 py-4 rounded w-full flex-1 mr-4"
        @focus="selectAll()"
      >

      <BaseButton
        :icon-left="copied ? 'done' : 'file_copy'"
        class="px-8 py-4 bg-gray-700 hover:bg-gray-600"
        :class="{
          'bg-green-600 hover:bg-green-600 text-green-100': copied,
        }"
        @click="!copied && copy()"
      >
        {{ copied ? 'Copied' : 'Copy' }}
      </BaseButton>
    </div>

    <div class="flex justify-center">
      <img
        :src="qrcode"
        alt="QR Code"
        class="rounded"
      >
    </div>
  </PopupModal>
</template>
