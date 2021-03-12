import GMR from 'graphql-merge-resolvers';
import resolversGenreMutation from './genre';
import resolversUserMutation from './user';
import resolversTagMutation from './tag';
import resolversMailMutation from './email';
import mutationStripeResolvers from './stripe/index';

const mutationResolvers = GMR.merge([
  resolversUserMutation,
  resolversGenreMutation,
  resolversTagMutation,
  resolversMailMutation,
  mutationStripeResolvers
]);

export default mutationResolvers;