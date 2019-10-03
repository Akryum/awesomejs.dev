export function checkUnauthorized (e) {
  if (e.graphQLErrors && e.graphQLErrors.some(e => e.extensions.code === 'unauthorized')) {
    this.$router.push({ name: 'login' })
  }
}
