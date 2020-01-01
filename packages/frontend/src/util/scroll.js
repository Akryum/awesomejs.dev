import { onUnmounted, watch } from '@vue/composition-api'

function getScrollParent (node) {
  if (node == null) {
    return null
  }

  if (node.scrollHeight > node.clientHeight || (node.classList && node.classList.contains('scroll-parent'))) {
    if (node === document.documentElement) {
      return { emitter: document, scroller: document.documentElement }
    }
    return { emitter: node, scroller: node }
  } else {
    return getScrollParent(node.parentNode)
  }
}

export function onScrollBottom (handler, el, offsetFromBottom) {
  let scrollParent

  function onScroll () {
    const { scroller } = scrollParent
    if (scroller.scrollTop >= scroller.scrollHeight - scroller.clientHeight - offsetFromBottom) {
      handler()
    }
  }

  function addListeners () {
    removeListeners()
    if (!el.value) return
    scrollParent = getScrollParent(el.value)
    if (scrollParent) {
      scrollParent.emitter.addEventListener('scroll', onScroll)
    }
  }

  function removeListeners () {
    if (scrollParent) {
      scrollParent.emitter.removeEventListener('scroll', onScroll)
    }
  }

  watch(el, () => {
    addListeners()
  })

  onUnmounted(() => {
    removeListeners()
  })
}
