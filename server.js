import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import jsonFile from 'jsonfile'
import axios from 'axios'
import _ from 'lodash'

const app = express()
const PORT = 3001

const pokemonType = new GraphQLObjectType({
  name: 'pokemonType',
  fields: {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString,
    },
    nameJP: {
      type: GraphQLString,
    },
    type: {
      type: new GraphQLList(GraphQLString),
    },
    species: {
      type: GraphQLString,
    },
    height: {
      type: GraphQLFloat,
      args: {
        unit: {
          type: GraphQLString
        }
      },
      resolve: ({ height }, { unit }) => {
        return (unit === 'FEET') ? height * 3.28084 : height
      }
      
    },
    weight: {
      type: GraphQLFloat,
    },
  }
}); 

const queryType = new GraphQLObjectType({
  name: 'queryPokemon',
  fields: {
    getPokemon: {
      type: new GraphQLList(pokemonType),
      resolve() {
        return axios.get('http://localhost:3002/pokemon', {})
        .then(result => result.data)
      }
    },
    getPokemonById: {
      type: pokemonType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve: (root, args) => {
        return axios.get('http://localhost:3002/pokemon', {})
        .then(result => {
          return _.find(result.data, {id: args.id })
        })
      }
    }
  }
})

const mutationType = new GraphQLObjectType({
  name: "mutationPokemon",
  fields: {
    addPokemon: {
      type: pokemonType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        },
        name: {
          type: new GraphQLNonNull(GraphQLString)
        },
        nameJP: {
          type: new GraphQLNonNull(GraphQLString)
        },
        type: {
          type: new GraphQLList(GraphQLString)
        },
        species: {
          type: GraphQLString
        },
        weight: {
          type: GraphQLFloat
        },
        height: {
          type: GraphQLFloat
        },
      },
      resolve: (root, args) => {
        return axios.post('http://localhost:3002/pokemon', args)
        .then(result => {
          return result.data
        })
      }
    },
    editPokemon: {
      type: pokemonType,
        args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        },
        name: {
          type: GraphQLString
        },
        nameJP: {
          type: GraphQLString
        },
        type: {
          type: GraphQLString
        },
        species: {
          type: GraphQLString
        },
        weight: {
          type: GraphQLFloat
        },
        height: {
          type: GraphQLFloat
        },
      },
      resolve: (root, args) => {
        return axios.patch(`http://localhost:3002/pokemon/${args.id}`, args)
        .then(result => {
          return result.data
        })
      }
    },
    deletePokemon: {
      type: pokemonType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        },
      },
      resolve: (root, args) => {
        return axios.delete(`http://localhost:3002/pokemon/${args.id}`, {})
        .then(result => {
          return result.data
        })
      }
    }
  }
})

const rootSchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
})

app.use('/graphql', graphqlHTTP({
  schema: rootSchema,
  graphiql: true
}));


app.listen(PORT);
console.log("Server running on localhost:", PORT);