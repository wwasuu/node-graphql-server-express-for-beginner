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
`

const query = `
  getPokemon: [Pokemon]
`

const mutation = `
  addPokemon(
    id: String!
    name: String!
    nameJP: String!
    type: [String]
    species: String
    height: Float
    weight: Float
    generationId: Int!
  ): Pokemon
  editPokemon(
    id: String!
    name: String
    nameJP: String
    type: [String]
    species: String
    height: Float
    weight: Float
    generationId: Int
  ): Pokemon
  deletePokemon(
    id: String!
  ): Pokemon
`

const resolvers = {
  Query: {
    getPokemon: (root, args, context) => {
      return axios.get('http://localhost:3002/pokemon', {})
      .then(result => result.data)
    }
  },
  Mutation: {
    addPokemon: (root, args, context) => {
      return axios.post('http://localhost:3002/pokemon', args)
      .then(result => result.data)
    },
    editPokemon: (root, args, context) => {
      return axios.patch(`http://localhost:3002/pokemon/${args.id}`, args)
      .then(result => result.data)
    },
    deletePokemon: (root, args, context) => {
      return axios.delete(`http://localhost:3002/pokemon/${args.id}`, {})
      .then(result => result.data)
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