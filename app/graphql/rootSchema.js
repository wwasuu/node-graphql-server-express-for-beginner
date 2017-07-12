import { makeExecutableSchema } from 'graphql-tools'
import _ from 'lodash'

import { 
  typeDefs as pokemonTypeDefs,
  query as pokemonQuery,
  mutation as pokemonMutation,
  resolvers as pokemonResolvers
} from './pokemon/schema'

import {
  typeDefs as generationTypeDefs,
  query as generationQuery,
  mutation as generationMutation,
  resolvers as generationResolvers
} from './generation/schema'

const moduleTypeDefs = [
  pokemonTypeDefs,
  generationTypeDefs 
]

const moduleQueries = [
  pokemonQuery,
  generationQuery
]

const moduleMutations = [
  pokemonMutation,
  generationMutation
]

const typeDefs = `
  ${moduleTypeDefs.join('\n')}

  # Root Query
  type Query {
    ${moduleQueries.join('\n')}
  }

  # Root Mutation
  type Mutation {
    ${moduleMutations.join('\n')}
  }

  # GraphQL Schema
  schema {
    query: Query
    mutation: Mutation
  }
`

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers: _.merge(pokemonResolvers, generationResolvers),
})

export default executableSchema