import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../../config/constants';
import bcrypt from 'bcrypt';
import { assignDocumentId, findOneElement, insertOneElement } from '../../lib/db-operations';

const resolversUserMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      // Check if the user doesn't exists
      const userCheck = await findOneElement(db, COLLECTIONS.USERS, { email: user.email });
      if (userCheck !== null) {
        return {
          status: false,
          message: `Email ${user.email} is already registered`,
          user: null 
        };
      }
      // Check the last register user to assign the ID
      user.id = await assignDocumentId(db, COLLECTIONS.USERS, { registerDate: -1 });
      // Assign the ISO format date on the registerDate field
      user.registerDate = new Date().toISOString();
      // Password crypting
      user.password = bcrypt.hashSync(user.password, 10);
      // Save the document (register) in the collection
      return await insertOneElement(db, COLLECTIONS.USERS, user).then(
        async () => {
          return {
            status: true,
            message: `User has been registered with the email ${user.email}`,
            user 
          };
        }
      ).catch((err: Error) => {
        console.log('=====ERROR=====');
        console.log(err.message);
        return {
          status: false,
          message: 'Unexpected error. Try again',
          user: null 
        };
      });
    }
  }
};

export default resolversUserMutation;