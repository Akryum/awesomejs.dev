import gql from 'graphql-tag'

export const pkg = gql`
fragment pkg on Package {
  id
  name
  description
  stars
  defaultLogo
  maintainers {
    name
    email
    avatar
  }
}
`
