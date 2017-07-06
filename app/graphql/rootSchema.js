import { makeExecutableSchema } from 'graphql-tools'
import _ from 'lodash'

import { 
  typeDefs as pokemonTypeDefs,
  query as pokemonQuery,
  resolvers as pokemonResolvers
} from './pokemon/schema'

import {
  typeDefs as generationTypeDefs,
  query as generationQuery,
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

const typeDefs = `
  ${moduleTypeDefs.join('\n')}

  # Root Query
  type Query {
    ${moduleQueries.join('\n')}
  }

  # GraphQL Schema
  schema {
    query: Query
  }
`

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers: _.merge(pokemonResolvers, generationResolvers),
})

export default executableSchema