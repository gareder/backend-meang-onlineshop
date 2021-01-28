import 'graphql-import-node';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import resolvers from '../resolves/index';

// import { loadFilesSync } from '@graphql-tools/load-files';
// import { mergeTypeDefs } from '@graphql-tools/merge';
import path from 'path';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

// const loadedFiles = loadFilesSync(`${__dirname}/**/*.graphql`);
// const typeDefs = mergeTypeDefs(loadedFiles);

const typesArray = fileLoader(path.join(`${__dirname}/**/*.graphql`));

const typeDefs = mergeTypes(typesArray, { all: true });

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: 'ignore'
  }
});

export default schema;