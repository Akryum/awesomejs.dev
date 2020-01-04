import gql from 'graphql-tag'
import { query as q, values } from 'faunadb'
import { sanitizeTags } from '@/util/tags'
import { ApolloError } from '@nodepack/plugin-apollo'
import { Resolvers } from '@/generated/schema'
import { mapDocument } from '@/util/fauna'

export const typeDefs = gql`
extend type Mutation {
  proposePackage (input: ProposePackageInput!): PackageProposal @auth
}

input ProposePackageInput {
  projectTypeId: ID!
  packageName: String!
  tags: [String!]!
}
`

export const resolvers: Resolvers = {
  Mutation: {
    proposePackage: async (root, { input }, ctx) => {
      input.tags = sanitizeTags(input.tags)

      if (await ctx.db.query(
        q.Exists(q.Match(q.Index('packageproposal_by_name'), input.packageName)),
      )) {
        throw new ApolloError('Package proposal already exists')
      }

      if (await ctx.db.query(
        q.Exists(q.Match(q.Index('packages_by_name'), input.packageName)),
      )) {
        throw new ApolloError('Package was already added')
      }

      // Npm check
      try {
        await ctx.npm(`/${encodeURIComponent(input.packageName)}`)
      } catch (e) {
        throw new ApolloError(`Package not found on npm`)
      }

      const doc = await ctx.db.query<values.Document<any>>(
        q.Create(
          q.Collection('PackageProposals'),
          {
            data: {
              name: input.packageName,
              projectTypes: [
                q.Ref(q.Collection('ProjectTypes'), input.projectTypeId),
              ],
              userRef: q.Ref(q.Collection('Users'), ctx.user.id),
              upvotes: 0,
              info: {
                tags: input.tags,
              },
              dataSources: {
                npm: {
                  name: input.packageName,
                },
              },
            },
          },
        ),
      )
      return mapDocument(doc)
    },
  },
}
