export function setFavicon (url) {
  document.head.querySelectorAll('link[rel*="icon"]').forEach(el => {
    el.href = url
  })
}

export function resetFavicon () {
  document.head.querySelectorAll('link[rel*="icon"]').forEach(el => {
    el.href = `${process.env.BASE_URL}favicon.png`
  })
}
