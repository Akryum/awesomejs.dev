import gql from 'graphql-tag'

export const userFragment = gql`
fragment user on User {
  id
  email
  nickname
  avatar
  admin
}
`
