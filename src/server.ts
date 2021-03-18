import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import enviroments from './config/enviroments';
import { ApolloServer, PubSub } from 'apollo-server-express';
import schema from './schema/index';
import expressPlayground from 'graphql-playground-middleware-express';
import Database from './lib/database';
import { IContext } from './interfaces/context.interface';


// Env var config
if (process.env.NODE_ENV !== 'production') {
  const env = enviroments;
  console.log(env);
}

async function init() {

  const app = express();
  const pubsub = new PubSub();
  
  app.use('*', cors());
  app.use(compression());

  const database = new Database();

  const db = await database.init();

  const context = async({ req, connection }: IContext) => {
    const token = (req) ? req.headers.authorization : connection.authorization;
    return { db, token, pubsub };
  };

  const server = new ApolloServer({
    schema,
    introspection: true,
    context
  });

  server.applyMiddleware({ app });
  
  app.get('/', expressPlayground({
    endpoint: '/graphql'
  }));
  
  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);
  const PORT = process.env.PORT || 8080;
  httpServer.listen(PORT, () => {
    console.log('=======SERVER CONNECTION=======');
    console.log(`GraphQL Server => @: http://localhost:${PORT}/graphql`);
    console.log(`WS Connection => @: ws:http://localhost:${PORT}/graphql`);
  });

}
init();
