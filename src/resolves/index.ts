import { IResolvers } from 'graphql-tools';
import query from './query/index';
import mutation from './mutation/index';

const resolvers: IResolvers = {
  ...query,
  ...mutation
};

export default resolvers;