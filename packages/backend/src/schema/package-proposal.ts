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
}

extend type Query {
  packageProposal (name: String!): PackageProposal
}

extend type Mutation {
  proposePackage (input: ProposePackageInput!): PackageProposal
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
      console.log(input)
      if (await ctx.db.query(
        q.Exists(q.Match(q.Index('packageproposal_by_name'), input.packageName))
      )) {
        throw new ApolloError('Package proposal already exists')
      }
      const { ref: { id }, data } = await ctx.db.query(
        q.Create(
          q.Collection('PackageProposals'),
          {
            data: {
              name: input.packageName,
              projectTypeRef: q.Ref(q.Collection('ProjectTypes'), input.projectTypeId),
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

