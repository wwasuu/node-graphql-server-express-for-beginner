import axios from 'axios'

const query = `
  getGeneration: [Generation]
`

const typeDefs = `
  type Generation {
    id: Int!
    game: [String]
    numberOfPokemon: Int
    region: String
  }
`

const resolvers = {
  Query: {
    getGeneration(root, args, context) {
      return axios.get('http://localhost:3002/generation', {})
      .then(result => result.data)
    }
  }
}

export {
  typeDefs,
  query,
  resolvers
}