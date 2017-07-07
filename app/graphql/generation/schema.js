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

const resolvers = {
  Query: {
    getGeneration(root, args, context) {
      return axios.get('http://localhost:3002/generation', {})
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
  resolvers
}