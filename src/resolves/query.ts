import { IResolvers } from 'graphql-tools';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from '../config/constants';
import JWT from '../lib/jwt';
import bcrypt from 'bcrypt';


const resolversQuery: IResolvers = {
  Query: {
    async users(_, __, { db }) {
      try {
        return {
          status: true,
          message: 'Users List',
          users: await db.collection(COLLECTIONS.USERS).find().toArray()
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message: 'Error to fetch the users',
          users: []
        };
      }
    },

    async login(_, { email, password }, { db }) {
      try {
        
        const user = await db.collection(COLLECTIONS.USERS).findOne({ email });
        if (user === null) {
          return {
            status: false,
            message: `'User doesn't exists`,
            token: null
          };
        }
        const passwordCheck = bcrypt.compareSync(password, user.password);
        if (passwordCheck !== null) {
          delete user.password;
          delete user.birthday;
          delete user.registerDate;
        }
        return {
          status: true,
          message: !passwordCheck ? 'Wrong Credentials' : 'Logged in!',
          token: !passwordCheck ? null : new JWT().sign({ user }, EXPIRETIME.H24)
        };

      } catch (error) {
        console.log(error);
        return {
          status: false,
          message: 'Error to load the user',
          token: null
        };
      }
    },

    me(_, __, { token }) {
      console.log(token);
      let info = new JWT().verify(token);
      if (info === MESSAGES.TOKEN_VERIFICATION_FAILED) {
        return {
          status: false,
          message: info,
          user: null
        };
      }
      return {
        status: true,
        message: 'User authenticated with token',
        user: Object.values(info)[0]
      };
    }
  },
};

export default resolversQuery;