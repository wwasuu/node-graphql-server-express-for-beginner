import {
  GraphQLObjectType,
  GraphQLList,
} from 'graphql'
import axios from 'axios'

import geneationType from './inputType'

const queryType = new GraphQLObjectType({
  name: 'queryGeneration',
  fields: {
    getGeneration: {
      type: new GraphQLList(geneationType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3002/generation`, {})
        .then(result => {
          return result.data
        })
      }
    }
  }
})

export default queryType