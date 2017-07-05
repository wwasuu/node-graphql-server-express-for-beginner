import express from 'express'
import graphqlHTTP from 'express-graphql'
import schema from './app/graphql/schema'

const app = express()
const PORT = 3001

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

const server = app.listen(PORT);
console.log("Server running on localhost:", PORT);
