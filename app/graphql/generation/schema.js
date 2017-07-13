import axios from 'axios'

const typeDefs = `
  type Generation {
    id: Int!
    game: [String]
    numberOfPokemon: Int
    region: String
    pokemon: [Pokemon]
  }
`

const query = `
  getGeneration: [Generation]
`

const mutation = `
  addGeneration (
    id: Int!
    game: [String]
    numberOfPokemon: Int
    region: String
  ): Generation
  editGeneration (
    id: Int!
    game: [String]
    numberOfPokemon: Int
    region: String
  ): Generation
  deleteGeneration (
    id: Int!
  ): Generation
`

const resolvers = {
  Query: {
    getGeneration: (root, args, context) => {
      return axios.get('http://localhost:3002/generation', {})
      .then(result => result.data)
    }
  },
  Mutation: {
    addGeneration: (root, args, context) => {
      return axios.post('http://localhost:3002/generation', args)
      .then(result => result.data)
    },
    editGeneration: (root, args, context) => {
      return axios.patch(`http://localhost:3002/generation/${args.id}`, args)
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