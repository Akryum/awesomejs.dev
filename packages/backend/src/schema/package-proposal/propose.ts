import gql from 'graphql-tag'
import { query as q } from 'faunadb'
import { sanitizeTags } from '@/util/tags'
import { ApolloError } from 'apollo-server-core'
import { Resolvers } from '@/generated/schema'

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

      const { ref: { id }, data } = await ctx.db.query(
        q.Create(
          q.Collection('PackageProposals'),
          {
            data: {
              name: input.packageName,
              projectTypeRef: q.Ref(q.Collection('ProjectTypes'), input.projectTypeId),
              userRef: q.Ref(q.Collection('Users'), ctx.user.id),
              upvotes: 0,
              info: {
                tags: input.tags,
              },
            },
          },
        ),
      )
      return {
        id,
        ...data,
      }
    },
  },
}
