import express from 'express'
import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express'
import bodyParser from 'body-parser'
import cors from 'cors'

import schema from './app/graphql/rootSchema'

const app = express()
const PORT = 3001

app.use(cors())
app.use(bodyParser.json())

app.use('/graphql', graphqlExpress(req => ({ schema })))

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}))

const server = app.listen(PORT);
console.log("Server running on localhost:", PORT)
