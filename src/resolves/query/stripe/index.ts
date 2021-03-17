import GMR from 'graphql-merge-resolvers';
import resolversStripeCardQuery from './card';
import resolversStripeChargeQuery from './charge';
import resolversStripeQuery from './customer';


const queryStripeResolvers = GMR.merge([
  resolversStripeQuery,
  resolversStripeCardQuery,
  resolversStripeChargeQuery
]);

export default queryStripeResolvers;