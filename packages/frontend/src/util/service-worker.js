import { ref } from '@vue/composition-api'

export const updateAvailable = ref(false)

export function applyUpdate () {
  location.reload()
}

export function useAppUpdate () {
  return {
    updateAvailable,
    applyUpdate,
  }
}
