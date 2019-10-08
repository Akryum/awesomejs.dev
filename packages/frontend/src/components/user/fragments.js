import gql from 'graphql-tag'

export const user = gql`
fragment user on User {
  id
  email
  nickname
  avatar
  admin
}
`
