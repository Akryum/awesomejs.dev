import router from '../router'

export function checkUnauthorized (e) {
  if (e.graphQLErrors && e.graphQLErrors.some(e => e.extensions.code === 'unauthorized')) {
    router.push({ name: 'login' })
  }
}
