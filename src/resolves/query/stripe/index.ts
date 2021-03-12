import GMR from 'graphql-merge-resolvers';
import resolversStripeCardQuery from './card';
import resolversStripeQuery from './customer';


const queryStripeResolvers = GMR.merge([
  resolversStripeQuery,
  resolversStripeCardQuery
]);

export default queryStripeResolvers;