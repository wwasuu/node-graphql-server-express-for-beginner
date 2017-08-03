import axios from 'axios'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql'
import { PubSub } from 'graphql-subscriptions'

import { getGenerationByIdLoader } from '../../dataloader'
import {
  getPokemon,
  getPokemonById,
  addPokemon
} from '../../services/pokemonService'

const pubSub = new PubSub()

const typeDefs = `
  type Pokemon {
    id: String!
    name: String!
    nameJP: String!
    type: [String]
    species: String
    height: Float
    weight: Float
    generationId: Int!
    generation: Generation
  }

  type PokemonsPayload {
    meta: Meta,
    data: [Pokemon],
    errors: [Error]
  }

  type PokemonPayload {
    meta: Meta,
    data: Pokemon,
    errors: [Error]
  }

  input PokemonInput {
    id: String!
    name: String!
    nameJP: String!
    type: [String]
    species: String
    height: Float
    weight: Float
    generationId: Int!
  }
`

const query = `
  getPokemon: PokemonsPayload
  getPokemonById(id: String!): PokemonPayload
`

const mutation = `
  addPokemon(input: PokemonInput): PokemonPayload
  editPokemon(input: PokemonInput): Pokemon
  deletePokemon(
    id: String!
  ): Meta
`

const subscription = `
  pokemonCreated: Pokemon
`

const resolvers = {
  Query: {
    getPokemon: (root, args, context) => {
      return getPokemon() 
      .then(result => {
        return {
          meta: {
            status: 200,
          },
          data: result.data,
          errors: []
        }
      })
    },
    getPokemonById: (root, args, context) => {
      return getPokemonById(args.id)
      .then(result => {
        return {
          meta: {
            status: 200,
          },
          data: result.data,
          errors: []
        }
      })
    },
  },
  Mutation: {
    addPokemon: (root, args, context) => {
      return addPokemon(args.input)
        .then(result => {
          pubSub.publish('pokemonCreated', { pokemonCreated: result.data })
          return {
            meta: {
              status: result.status,
            },
            data: result.data,
            errors: []
          }
        })
        .catch(err => {
          return {
            meta: {
              status: 500,
            },
            data: null,
            errors: [
              {
                code: 500,
                message: 'Internal server error'
              }
            ]
          }
        })
    },
    editPokemon: (root, args, context) => {
      return axios.patch(`http://localhost:3002/pokemon/${args.input.id}`, args.input)
      .then(result => result.data)
    },
    deletePokemon: (root, args, context) => {
      return axios.delete(`http://localhost:3002/pokemon/${args.id}`, {})
      .then(result => ({
        status: 200,
        message: 'success'
      }))
    },
  },
  Subscription: {
    pokemonCreated: {
      subscribe: () => pubSub.asyncIterator('pokemonCreated')
    }
  },
  Pokemon: {
    generation: (root) => {
      return axios.get(`http://localhost:3002/generation/${root.generationId}`, {})
      .then(result => result.data)
    }
  }
}

export  {
  typeDefs,
  query,
  mutation,
  subscription,
  resolvers
}