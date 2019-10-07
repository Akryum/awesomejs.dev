import gql from 'graphql-tag'
import { IResolvers } from 'graphql-tools'
import { Context } from '@/context'
import { query as q, values } from 'faunadb'
import { ApolloError } from 'apollo-server-core'
import * as Metadata from './metadata'

const getNpmMetadata = Metadata.getNpmMetadata('PackageProposals')
const getGithubMetadata = Metadata.getGithubMetadata('PackageProposals')

export const typeDefs = gql`
type PackageProposal {
  id: ID!
  name: String!
  projectType: ProjectType!
  user: User
  upvotes: Int!
  upvoted: Boolean!
  maintainers: [PackageMaintainer!]!
  description: String
  stars: Int
  repo: String
  homepage: String
  license: String
  defaultLogo: String
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

extend type Mutation {
  proposePackage (input: ProposePackageInput!): PackageProposal @auth
  togglePackageProposalUpvote (input: TogglePackageProposalUpvoteInput!): PackageProposal @auth
}

input ProposePackageInput {
  projectTypeId: ID!
  packageName: String!
  tags: [String!]!
}

input TogglePackageProposalUpvoteInput {
  proposalId: ID!
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
    },

    stars: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).stars,
    repo: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).htmlUrl,
    defaultLogo: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).owner.avatar,
    maintainers: async (pkg, args, ctx) => (await getNpmMetadata(pkg, ctx)).maintainers,
    homepage: async (pkg, args, ctx) => (await getNpmMetadata(pkg, ctx)).homepage,
    license: async (pkg, args, ctx) => (await getNpmMetadata(pkg, ctx)).license,
    description: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).description ||
      (await getNpmMetadata(pkg, ctx)).description,

    upvoted: async (pkg, args, ctx) => {
      if (!ctx.user) return false
      return ctx.db.query(
        q.Exists(q.Match(
          q.Index('packageproposalupvotes_by_proposal_and_user'),
          q.Ref(q.Collection('Users'), ctx.user.id),
          q.Ref(q.Collection('PackageProposals'), pkg.id)
        ))
      )
    },
  },

  ProjectType: {
    packageProposals: async (projectType, args, ctx) => {
      const { data } = await ctx.db.query(
        q.Map(
          q.Paginate(
            q.Match(
              q.Index('packageproposals_by_projecttyperef_sort_by_upvote'),
              q.Ref(q.Collection('ProjectTypes'), projectType.id)
            )
          ),
          q.Lambda(['upvotes', 'ref'], q.Get(q.Var('ref'))),
        )
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
            q.Ref(q.Collection('ProjectTypes'), projectType.id)
          )
        )
      )
      return data.length
    },
  },

  Query: {
    packageProposal: async (root, { id }, ctx) => {
      const { data } = await ctx.db.query(
        q.Get(q.Ref(q.Collection('PackageProposals'), id))
      )
      return {
        id,
        ...data,
      }
    },

    packageProposalByName: async (root, { name }, ctx) => {
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
              upvotes: 0,
              info: {
                tags: input.tags,
              }
            }
          }
        )
      )
      return {
        id,
        ...data,
      }
    },

    togglePackageProposalUpvote: async (root, { input }, ctx) => {
      const ref = q.Ref(q.Collection('PackageProposals'), input.proposalId)
      const userRef = q.Ref(q.Collection('Users'), ctx.user.id)
      const match = q.Match(
        q.Index('packageproposalupvotes_by_proposal_and_user'),
        userRef,
        ref,
      )
      const { data } = await ctx.db.query(
        q.Get(ref)
      )
      if (await ctx.db.query(q.Exists(match))) {
        await ctx.db.query(
          q.Do(
            q.Delete(q.Select(['ref'], q.Get(match))),
            q.Update(ref, {
              data: {
                upvotes: --data.upvotes,
              },
            })
          )
        )
      } else {
        await ctx.db.query(
          q.Do(
            q.Create(
              q.Collection('PackageProposalUpvotes'),
              {
                data: {
                  proposalRef: ref,
                  userRef,
                }
              }
            ),
            q.Update(ref, {
              data: {
                upvotes: ++data.upvotes,
              },
            })
          )
        )
      }
      return {
        id: input.proposalId,
        ...data,
      }
    }
  }
}

