export function useShare (callback = (info) => info) {
  if (navigator.share) {
    return (info) => navigator.share(callback(info))
  }
  return false
}
