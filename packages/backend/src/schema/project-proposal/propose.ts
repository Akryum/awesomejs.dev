import gql from 'graphql-tag'
import { query as q, values } from 'faunadb'
import { Resolvers } from '@/generated/schema'
import { mapDocument } from '@/util/fauna'

export const typeDefs = gql`
extend type Mutation {
  proposeProject (input: ProposeProjectInput!): ProjectType @auth
}

input ProposeProjectInput {
  name: String!
}
`

export const resolvers: Resolvers = {
  Mutation: {
    proposeProject: async (root, { input }, ctx) => {
      const doc = await ctx.db.query<values.Document<any>>(
        q.Create(
          q.Collection('ProjectProposal'),
          {
            data: {
              name: input.name,
              logo: `https://github.com/${input.name}.png?size=200`,
              slug: input.name.toLocaleLowerCase()
            },
          },
        ),
      )
      return mapDocument(doc)
    },
  },
}
