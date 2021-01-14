import { IResolvers } from 'graphql-tools';
import GenresService from '../../services/genre.service';


const resolversGenreMutation: IResolvers = {
  Mutation: { 
    addGenre(_, variables, context) {
      // Call the service
      return new GenresService(_, variables, context).insert();
    },

    updateGenre(_, variables, context) {
      // Call the service
      return new GenresService(_, variables, context).mofidy();
    },

    deleteGenre(_, variables, context) {
      // Call the service
      return new GenresService(_, variables, context).delete();
    }
  }
};

export default resolversGenreMutation;
