import { IResolvers } from 'graphql-tools';
import query from './query/index';
import mutation from './mutation/index';
import type from './type/index';
import subscriptionResolvers from './subscription';

const resolvers: IResolvers = {
  ...query,
  ...mutation,
  ...type,
  ...subscriptionResolvers
};

export default resolvers;