import { IResolvers } from 'graphql-tools';
import query from './query/index';
import mutation from './mutation/index';
import type from './type/index';

const resolvers: IResolvers = {
  ...query,
  ...mutation,
  ...type
};

export default resolvers;