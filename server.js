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

import pokemonJson from './data/pokemon.json'

const pokemonData = pokemonJson
const pokemonJsonPath = './data/pokemon.json'
const app = express()
const PORT = 3001

const jobLocationType = new GraphQLObjectType({
  name: 'jobLocationType',
  fields: {
    id: {
      type: GraphQLString,
    },
    name: {
      type: new GraphQLList(GraphQLString)
    },
  },
})

const jobType = new GraphQLObjectType({
  name: 'jobType',
  fields: {
    id: {
      type: GraphQLInt
    },
    job_title_kw: {
      type: GraphQLString,
    },
    company_name_kw: {
      type: GraphQLString,
    },
    job_location: {
      type: new GraphQLList(jobLocationType)
    },
    salary: {
      type: GraphQLString,
    },
    urgent_job: {
      type: GraphQLInt,
    },
  }
})

const queryType = new GraphQLObjectType({
  name: 'queryPokemon',
  fields: {
    getJobs: {
      type: new GraphQLList(jobType),
      resolve() {
        return axios.get('https://dev-service.portfolio.tech/api/v1/jobs?location=all&job_type=all', {})
        .then(result => result.data.data)
      }
    },
  }
})

const querySchema = new GraphQLSchema({
  query: queryType,
})

app.use('/graphql', graphqlHTTP({
  schema: querySchema,
  graphiql: true
}));

app.listen(PORT);
console.log("Server running on localhost:", PORT);