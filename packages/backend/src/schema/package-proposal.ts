import gql from 'graphql-tag'
import { IResolvers } from 'graphql-tools'
import { Context } from '@/context'
import { query as q } from 'faunadb'
import { ApolloError } from 'apollo-server-core'

export const typeDefs = gql`
type PackageProposal {
  id: ID!
  name: String!
  tags: [String!]!
  projectType: ProjectType!
  user: User
}

extend type Query {
  packageProposal (name: String!): PackageProposal
}

extend type Mutation {
  proposePackage (input: ProposePackageInput!): PackageProposal @auth
}

input ProposePackageInput {
  projectTypeId: ID!
  packageName: String!
  tags: [String!]!
}
`
export const resolvers:IResolvers<any, Context> = {
  PackageProposal: {
    projectType: async (proposal, args, ctx) => {
      const { ref: { id }, data } = await ctx.db.query(
        q.Get(proposal.projectTypeRef)
      )
      return {
        id,
        ...data,
      }
    },

    user: async (proposal, args, ctx) => {
      try {
        const { ref: { id }, data } = await ctx.db.query(
          q.Get(proposal.userRef)
        )
        return {
          id,
          ...data,
        }
      } catch (e) {}
    }
  },

  Query: {
    packageProposal: async (root, { name }, ctx) => {
      try {
        const { ref: { id }, data } = await ctx.db.query(
          q.Get(q.Match(q.Index('packageproposal_by_name'), name))
        )
        return {
          id,
          ...data,
        }
      } catch (e) {}
    }
  },

  Mutation: {
    proposePackage: async (root, { input }, ctx) => {
      if (await ctx.db.query(
        q.Exists(q.Match(q.Index('packageproposal_by_name'), input.packageName))
      )) {
        throw new ApolloError('Package proposal already exists')
      }

      if (await ctx.db.query(
        q.Exists(q.Match(q.Index('packages_by_name'), input.packageName))
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
              tags: input.tags,
            }
          }
        )
      )
      return {
        id,
        ...data,
      }
    }
  }
}

