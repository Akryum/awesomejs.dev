import { SchemaDirectiveVisitor } from 'graphql-tools'
import { defaultFieldResolver, GraphQLField } from 'graphql'
import { gql, ApolloError } from 'apollo-server-core'
import { ErrorCode } from '@/const/error-codes'

export const typeDefs = gql`
"""
Field requiring authenticated user.
Otherwise, a 'unauthorized' error is thrown.
"""
directive @admin on FIELD_DEFINITION
`

export const schemaDirectives = {
  admin: class AuthDirective extends SchemaDirectiveVisitor {
    public visitFieldDefinition (field: GraphQLField<any, any>) {
      const { resolve = defaultFieldResolver } = field
      field.resolve = (root, args, context, info) => {
        if (!context.user.admin) { throw new ApolloError('Access denied', ErrorCode.ERROR_UNAUTHORIZED) }
        return resolve(root, args, context, info)
      }
    }
  },
}
