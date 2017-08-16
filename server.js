import express from 'express'
import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'
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
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
}))

// Wrap the Express server
const ws = createServer(app)
const server = ws.listen(PORT, () => {
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  })
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
})

export default server
