import gql from 'graphql-tag'
import { IResolvers } from 'graphql-tools'
import { Context } from '@/context'
import { query as q, values } from 'faunadb'
import * as Metadata from '../../util/metadata'
import { getReadme } from '@/util/readme'

const getNpmMetadata = Metadata.getNpmMetadata('PackageProposals')
const getGithubMetadata = Metadata.getGithubMetadata('PackageProposals')

export const typeDefs = gql`
type PackageProposal {
  id: ID!
  name: String!
  projectType: ProjectType!
  user: User
  maintainers: [PackageMaintainer!]!
  description: String
  stars: Int
  repo: String
  homepage: String
  license: String
  defaultLogo: String
  readme: String
  info: PackageInfo!
}

extend type ProjectType {
  packageProposals: [PackageProposal!]!
  packageProposalCount: Int!
}

extend type Query {
  packageProposal (id: ID!): PackageProposal
  packageProposalByName (name: String!): PackageProposal
}
`
export const resolvers: IResolvers<any, Context> = {
  PackageProposal: {
    projectType: async (proposal, args, ctx) => {
      const { ref: { id }, data } = await ctx.db.query(
        q.Get(proposal.projectTypeRef),
      )
      return {
        id,
        ...data,
      }
    },

    user: async (proposal, args, ctx) => {
      try {
        const { ref: { id }, data } = await ctx.db.query(
          q.Get(proposal.userRef),
        )
        return {
          id,
          ...data,
        }
      } catch (e) {
        // Nothing
      }
    },

    stars: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).stars,
    repo: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).htmlUrl,
    defaultLogo: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).owner.avatar,
    maintainers: async (pkg, args, ctx) => (await getNpmMetadata(pkg, ctx)).maintainers,
    homepage: async (pkg, args, ctx) => (await getNpmMetadata(pkg, ctx)).homepage,
    license: async (pkg, args, ctx) => (await getNpmMetadata(pkg, ctx)).license,
    description: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).description ||
      (await getNpmMetadata(pkg, ctx)).description,
    readme: (pkg, args, ctx) => getReadme(pkg, getGithubMetadata, ctx),
  },

  ProjectType: {
    packageProposals: async (projectType, args, ctx) => {
      const { data } = await ctx.db.query(
        q.Map(
          q.Paginate(
            q.Match(
              q.Index('packageproposals_by_projecttyperef_sort_by_upvote'),
              q.Ref(q.Collection('ProjectTypes'), projectType.id),
            ),
          ),
          q.Lambda(['upvotes', 'ref'], q.Get(q.Var('ref'))),
        ),
      )
      return data.map((doc: values.Document) => ({
        id: doc.ref.id,
        ...doc.data,
      }))
    },

    packageProposalCount: async (projectType, args, ctx) => {
      const { data } = await ctx.db.query(
        q.Paginate(
          q.Match(
            q.Index('packageproposals_by_projecttyperef_sort_by_upvote'),
            q.Ref(q.Collection('ProjectTypes'), projectType.id),
          ),
        ),
      )
      return data.length
    },
  },

  Query: {
    packageProposal: async (root, { id }, ctx) => {
      const { data } = await ctx.db.query(
        q.Get(q.Ref(q.Collection('PackageProposals'), id)),
      )
      return {
        id,
        ...data,
      }
    },

    packageProposalByName: async (root, { name }, ctx) => {
      try {
        const { ref: { id }, data } = await ctx.db.query(
          q.Get(q.Match(q.Index('packageproposal_by_name'), name)),
        )
        return {
          id,
          ...data,
        }
      } catch (e) {
        // Nothing
      }
    },
  },
}

