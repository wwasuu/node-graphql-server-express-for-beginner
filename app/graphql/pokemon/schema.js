import axios from 'axios'

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
  addPokemon(input: PokemonInput): Pokemon
  editPokemon(input: PokemonInput): Pokemon
  deletePokemon(
    id: String!
  ): Meta
`

const resolvers = {
  Query: {
    getPokemon: (root, args, context) => {
      return axios.get('http://localhost:3002/pokemon', {})
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
      return axios.get(`http://localhost:3002/pokemon/${args.id}`, {})
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
      return axios.post('http://localhost:3002/pokemon', args.input)
      .then(result => result.data)
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
  resolvers
}