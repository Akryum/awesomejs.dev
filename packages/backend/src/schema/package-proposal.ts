import gql from 'graphql-tag'
import { IResolvers } from 'graphql-tools'
import { Context } from '@/context'
import { query as q, values } from 'faunadb'
import { ApolloError } from 'apollo-server-core'
import * as Metadata from '../util/metadata'
import { indexPackage } from '../util/package-index'
import { getReadme } from '@/util/readme'
import { sanitizeTags } from '@/util/tags'

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

extend type Mutation {
  proposePackage (input: ProposePackageInput!): PackageProposal @auth
  togglePackageProposalUpvote (input: TogglePackageProposalUpvoteInput!): PackageProposal @auth
  approvePackageProposal (input: ApprovePackageProposalInput!): Package @admin @auth
  editPackageProposalInfo (input: EditPackageProposalInfoInput!): PackageProposal @admin @auth
}

input ProposePackageInput {
  projectTypeId: ID!
  packageName: String!
  tags: [String!]!
}

input TogglePackageProposalUpvoteInput {
  proposalId: ID!
}

input ApprovePackageProposalInput {
  proposalId: ID!
}

input EditPackageProposalInfoInput {
  proposalId: ID!
  info: PackageInfoInput!
  github: GitHubRepoInput
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

    upvoted: async (pkg, args, ctx) => {
      if (!ctx.user) { return false }
      return ctx.db.query(
        q.Exists(q.Match(
          q.Index('packageproposalupvotes_by_proposal_and_user'),
          q.Ref(q.Collection('Users'), ctx.user.id),
          q.Ref(q.Collection('PackageProposals'), pkg.id),
        )),
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

    togglePackageProposalUpvote: async (root, { input }, ctx) => {
      const ref = q.Ref(q.Collection('PackageProposals'), input.proposalId)
      const userRef = q.Ref(q.Collection('Users'), ctx.user.id)
      const match = q.Match(
        q.Index('packageproposalupvotes_by_proposal_and_user'),
        userRef,
        ref,
      )
      const { data } = await ctx.db.query(
        q.Get(ref),
      )
      if (await ctx.db.query(q.Exists(match))) {
        await ctx.db.query(
          q.Do(
            q.Delete(q.Select(['ref'], q.Get(match))),
            q.Update(ref, {
              data: {
                upvotes: --data.upvotes,
              },
            }),
          ),
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
                },
              },
            ),
            q.Update(ref, {
              data: {
                upvotes: ++data.upvotes,
              },
            }),
          ),
        )
      }
      return {
        id: input.proposalId,
        ...data,
      }
    },

    approvePackageProposal: async (root, { input }, ctx) => {
      const pkgProposal: any = await ctx.db.query(
        q.Get(q.Ref(q.Collection('PackageProposals'), input.proposalId)),
      )
      const projectType: any = await ctx.db.query(
        q.Get(pkgProposal.data.projectTypeRef),
      )
      const tagMap = projectType.data.tagMap
      for (const tag of pkgProposal.data.info.tags) {
        tagMap[tag] = tagMap[tag] || 0
        tagMap[tag]++
      }
      const pkg: any = await ctx.db.query(
        q.Do(
          q.Delete(pkgProposal.ref),
          q.Update(
            projectType.ref,
            {
              data: {
                tagMap,
              },
            },
          ),
          q.Create(
            q.Collection('Packages'),
            {
              data: {
                name: pkgProposal.data.name,
                projectTypeId: projectType.ref.id,
                github: pkgProposal.data.github,
                info: pkgProposal.data.info,
                metadata: pkgProposal.data.metadata,
              },
            },
          ),
        ),
      )
      await indexPackage(ctx, pkg, projectType)
      return {
        id: pkg.ref.id,
        ...pkg.data,
      }
    },

    editPackageProposalInfo: async (root, { input }, ctx) => {
      input.info.tags = sanitizeTags(input.info.tags)

      const ref = q.Ref(q.Collection('PackageProposals'), input.proposalId)
      const { data } = await ctx.db.query(
        q.Do(
          q.Update(ref, {
            data: {
              info: input.info,
              github: input.github,
              metadata: {
                github: null,
              },
            },
          }),
          q.Get(ref),
        ),
      )
      return {
        id: input.proposalId,
        ...data,
      }
    },
  },
}

