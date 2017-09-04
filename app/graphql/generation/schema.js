import axios from 'axios'
import * as generationService  from '../../services/generationService'

const typeDefs = `
  type Generation {
    id: Int!
    game: [String]
    numberOfPokemon: Int
    region: String
    pokemon: [Pokemon]
  }

  type GenerationsPayload {
    meta: Meta,
    data: [Generation],
    errors: [Error]
  }

  type GenerationPayload {
    meta: Meta,
    data: Generation,
    errors: [Error]
  }

  input GeneationInput {
    id: Int!
    game: [String]
    numberOfPokemon: Int
    region: String
  }
`

const query = `
  getGeneration: GenerationsPayload
  getGenerationById: GenerationPayload
`

const mutation = `
  addGeneration (input: GeneationInput): Generation
  editGeneration (input: GeneationInput): Generation
  deleteGeneration (
    id: Int!
  ): Generation
`

const resolvers = {
  Query: {
    getGeneration: (root, args, context) => {
      return generationService.getGeneration()
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
    getGenerationById: (root, args, context) => {
      return generationService.getGenerationById(args.id)
      .then(result => {
        return {
          meta: {
            status: 200,
          },
          data: result.data,
          errors: []
        }
      })
    }
  },
  Mutation: {
    addGeneration: (root, args, context) => {
      return axios.post('http://localhost:3002/generation', args)
      .then(result => result.data)
    },
    editGeneration: (root, args, context) => {
      return axios.patch(`http://localhost:3002/generation/${args.input.id}`, args.input)
      .then(result => result.data)
    },
    deleteGeneration: (root, args, context) => {
      return axios.delete(`http://localhost:3002/generation/${args.id}`, {})
      .then(result => result.data)
    }
  },
  Generation: {
    pokemon: (root) => {
      return axios.get(`http://localhost:3002/pokemon?generationId=${root.id}`, {})
      .then(result => result.data)
    }
  }
}

export {
  typeDefs,
  query,
  mutation,
  resolvers
}