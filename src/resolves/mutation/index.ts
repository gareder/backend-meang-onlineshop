import GMR from 'graphql-merge-resolvers';
import resolversGenreMutation from './genre';
import resolversUserMutation from './user';
import resolversTagMutation from './tag';
import resolversMailMutation from './email';

const mutationResolvers = GMR.merge([
  resolversUserMutation,
  resolversGenreMutation,
  resolversTagMutation,
  resolversMailMutation
]);

export default mutationResolvers;