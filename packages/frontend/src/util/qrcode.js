import QRCode from 'qrcode'
import { ref, watch, isRef } from '@vue/composition-api'

export function useQrcode (url) {
  const src = ref('')

  watch(isRef(url) ? url : () => url, async (value) => {
    if (value) {
      src.value = await QRCode.toDataURL(value, {
        errorCorrectionLevel: 'H',
      })
    }
  })

  return src
}
