import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'

export const typeDefs = gql`
type User {
  id: ID!
  nickname: String!
  email: String!
  accounts: [UserAccount!]!
  avatar: String
  admin: Boolean
}

type UserAccount {
  id: ID!
  provider: String!
  profileId: ID!
  nickname: String
  profileUrl: String
}

type Query {
  currentUser: User
}
`

export const resolvers: Resolvers = {
  Query: {
    // @ts-ignore
    currentUser: (root, args, ctx) => ctx.user,
  },
}
