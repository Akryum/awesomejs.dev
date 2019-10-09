import { ref } from '@vue/composition-api'

export const updateAvailable = ref(false)
export const updateRegistration = ref(null)

export function applyUpdate () {
  if (updateRegistration.value.installing) {
    updateRegistration.value.installing.addEventListener('statechange', () => {
      if (updateRegistration.value.installing.state === 'installed') {
        refreshApp(updateRegistration.value.installing)
      }
    })
  } else if (updateRegistration.value.waiting) {
    refreshApp(updateRegistration.value.waiting)
  }
}

export function useAppUpdate () {
  return {
    updateAvailable,
    applyUpdate,
  }
}

function refreshApp (sw) {
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })
  sw.postMessage({ type: 'SKIP_WAITING' })
}
