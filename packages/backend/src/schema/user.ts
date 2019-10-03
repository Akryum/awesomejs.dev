import gql from 'graphql-tag'
import { IResolvers } from 'graphql-tools'
import { Context } from '@/context'

export const typeDefs = gql`
type User {
  id: ID!
  nickname: String!
  email: String!
  accounts: [UserAccount!]!
  avatar: String
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

export const resolvers: IResolvers<any, Context> = {
  Query: {
    currentUser: (root, args, ctx) => ctx.user,
  },
}
