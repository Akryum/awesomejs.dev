import { ref, watch, onMounted, onActivated, onDeactivated, onUnmounted } from '@vue/composition-api'

const CLASS = 'no-scroll'

export function useLockScroll (selector = 'body, .auto-lock-scroll', auto = true) {
  const locked = ref(false)

  function update () {
    const els = document.querySelectorAll(selector)
    els.forEach(el => {
      if (locked.value) {
        el.classList.add(CLASS)
      } else {
        el.classList.remove(CLASS)
      }
    })
  }

  watch(locked, () => update())

  function lock () {
    locked.value = true
  }

  function unlock () {
    locked.value = false
  }

  if (auto) {
    onMounted(lock)
    onActivated(lock)
    onDeactivated(unlock)
    onUnmounted(() => {
      unlock()
      // Need to manually update as the instance is being destroyed
      // (no more reactivity updates)
      update()
    })
  }

  return {
    locked,
    lock,
    unlock,
  }
}
