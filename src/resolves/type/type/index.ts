import GMR from 'graphql-merge-resolvers';
import resolversStripeCharge from './charge';


const TypeStripeResolvers = GMR.merge([
  resolversStripeCharge
]);

export default TypeStripeResolvers;