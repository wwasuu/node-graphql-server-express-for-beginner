import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
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
      resolve: (value, args) => {
        return axios.get('http://localhost:3002/pokemon', {})
        .then(result => {
          console.log(result.data)
          return _.find(result.data, {id: args.id })
        })
      }
    }
  }
})

const rootSchema = new GraphQLSchema({
  query: queryType,
})

app.use('/graphql', graphqlHTTP({
  schema: rootSchema,
  graphiql: true
}));


app.listen(PORT);
console.log("Server running on localhost:", PORT);