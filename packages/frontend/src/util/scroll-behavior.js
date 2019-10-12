// scrollBehavior:
// - only available in html5 history mode
// - defaults to no scroll behavior
// - return false to prevent scroll
export const scrollBehavior = function (to, from, savedPosition) {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    const position = {}

    // scroll to anchor by returning the selector
    if (to.hash) {
      position.selector = to.hash

      // bypass #1number check
      if (/^#\d/.test(to.hash) || document.querySelector(to.hash)) {
        return position
      }

      // if the returned position is falsy or an empty object,
      // will retain current scroll position.
      return false
    }

    if (window.innerWidth <= 768 || !to.matched.some(m => m.meta.keepScroll)) {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      position.x = 0
      position.y = 0
    }

    return position
  }
}
