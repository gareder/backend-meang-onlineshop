import GMR from 'graphql-merge-resolvers';
import resolversStripeCardMutation from './card';
import resolversStripeChargerMutation from './charge';
import resolversStripeCustomerMutation from './customer';


const mutationStripeResolvers = GMR.merge([
  resolversStripeCustomerMutation,
  resolversStripeCardMutation,
  resolversStripeChargerMutation
]);

export default mutationStripeResolvers;