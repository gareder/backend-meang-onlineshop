import 'graphql-import-node';
import typeDefs from './schema.graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import resolvers from '../resolves/index';

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;