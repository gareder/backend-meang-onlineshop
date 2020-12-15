import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../config/constants';
import bcrypt from 'bcrypt';

const resolversMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      // Check if the user doesn't exists
      const userCheck = await db.collection(COLLECTIONS.USERS).findOne({ email: user.email });
      if (userCheck !== null) {
        return {
          status: false,
          message: `Email ${user.email} is already registered`,
          user: null 
        };
      }
      // Check the last register user to assign the ID
      const lastUser = await db.collection(COLLECTIONS.USERS).find().limit(1).sort({ registerDate: -1 }).toArray();
      if (lastUser.length === 0) {
        user.id = 1;
      } else {
        user.id = lastUser[0].id + 1;
      }
      // Assign the ISO format date on the registerDate field
      user.registerDate = new Date().toISOString();
      // Password crypting
      user.password = bcrypt.hashSync(user.password, 10);
      // Save the document (register) in the collection
      return await db.collection(COLLECTIONS.USERS).insertOne(user).then(
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

export default resolversMutation;