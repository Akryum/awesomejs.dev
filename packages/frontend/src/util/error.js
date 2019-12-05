import router from '../router'

export function checkNeedLogin (e) {
  if (e.graphQLErrors && e.graphQLErrors.some(e => e.extensions.code === 'guest')) {
    router.push({ name: 'login' })
  }
}
