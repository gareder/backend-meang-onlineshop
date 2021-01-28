import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import enviroments from './config/enviroments';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema/index';
import expressPlayground from 'graphql-playground-middleware-express';
import Database from './lib/database';
import { IContext } from './interfaces/context.interface';
import chalk from 'chalk';


// Env var config
if (process.env.NODE_ENV !== 'production') {
  const env = enviroments;
  console.log(env);
}

async function init() {

  const app = express();
  
  app.use('*', cors());
  app.use(compression());

  const database = new Database();

  const db = await database.init();

  const context = async({ req, connection }: IContext) => {
    const token = (req) ? req.headers.authorization : connection.authorization;
    return { db, token }
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
  const PORT = process.env.PORT || 8080;
  httpServer.listen(PORT, () => {
    console.log('=======SERVER CONNECTION=======');
    console.log(`STATUS: ${chalk.greenBright('ONLINE ON 8080')}`);
  });

}
init();
