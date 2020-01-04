import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import { ApolloError } from '@nodepack/plugin-apollo'
import { ErrorCode } from '@/const/error-codes'
import { query as q } from 'faunadb'
import { mapDocuments } from '@/util/fauna'

export const typeDefs = gql`
type User {
  id: ID!
  nickname: String!
  email: String!
  accounts: [UserAccount!]!
  avatar: String
  admin: Boolean
  teams: [Team!]!
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
  allUsers: [User!]! @admin @auth
}
`

export const resolvers: Resolvers = {
  User: {
    accounts: (user, args, ctx) => {
      if (user !== ctx.user as any) {
        throw new ApolloError('Unauthorized', ErrorCode.ERROR_UNAUTHORIZED)
      }
      return user.accounts
    },

    teams: async (user, args, ctx) => {
      const { data } = await ctx.db.query(q.Map(
        q.Paginate(q.Match(q.Index('teams_by_user'), user.ref), { size: 1000 }),
        q.Lambda(['ref'], q.Get(q.Var('ref'))),
      ))
      return mapDocuments(data)
    },
  },

  Query: {
    // @ts-ignore
    currentUser: (root, args, ctx) => ctx.user,

    allUsers: async (root, args, ctx) => {
      const { data } = await ctx.db.query(q.Map(
        q.Paginate(q.Match(q.Index('all_users')), { size: 10000 }),
        q.Lambda(['ref'], q.Get(q.Var('ref'))),
      ))
      return mapDocuments(data)
    },
  },
}
