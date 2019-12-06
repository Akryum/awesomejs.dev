import gql from 'graphql-tag'
import { query as q } from 'faunadb'
import { Resolvers } from '@/generated/schema'

export const typeDefs = gql`
extend type ProjectType {
  bookmarked: Boolean
}

extend type Mutation {
  toggleProjectTypeBookmark (input: ToggleProjectTypeBookmarkInput!): ProjectType @auth
}

input ToggleProjectTypeBookmarkInput {
  projectTypeId: ID!
}
`

export const resolvers: Resolvers = {
  ProjectType: {
    bookmarked: (projectType, args, ctx) => {
      return ctx.user && ctx.user.projectTypeBookmarks &&
        ctx.user.projectTypeBookmarks.includes(projectType.id)
    },
  },

  Mutation: {
    toggleProjectTypeBookmark: async (root, { input: { projectTypeId } }, ctx) => {
      let bookmarks = ctx.user.projectTypeBookmarks
      if (!bookmarks) {
        bookmarks = [projectTypeId]
      } else {
        const index = bookmarks.indexOf(projectTypeId)
        if (index === -1) {
          bookmarks.push(projectTypeId)
        } else {
          bookmarks.splice(index, 1)
        }
      }
      const { ref: { id }, data } = await ctx.db.query(
        q.Do(
          q.Update(
            q.Ref(q.Collection('Users'), ctx.user.id),
            {
              data: {
                projectTypeBookmarks: bookmarks,
              },
            },
          ),
          q.Get(q.Ref(q.Collection('ProjectTypes'), projectTypeId)),
        ),
      )
      if (data) {
        return {
          id,
          ...data,
        }
      }
    },
  },
}
