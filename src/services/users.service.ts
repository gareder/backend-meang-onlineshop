import { COLLECTIONS, EXPIRETIME, MESSAGES } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import { findOneElement, assignDocumentId, insertOneElement } from '../lib/db-operations';
import ResolversOperationsService from './resolvers-operations.service';
import bcrypt from 'bcrypt';
import JWT from '../lib/jwt';


class UsersService extends ResolversOperationsService {

  private collection = COLLECTIONS.USERS;
  
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  // Users list
  async items() {
    const result = await this.list(this.collection, 'users');
    return {
      status: result.status,
      message: result.message,
      users: result.items
    };
  }
  // Log in
  async login() {
    try {
      const variables = this.getVariables().user;
      const user = await findOneElement(this.getDb(), this.collection, { email: variables?.email });
      if (user === null) {
        return {
          status: false,
          message: `'User doesn't exists`,
          token: null
        };
      }
      const passwordCheck = bcrypt.compareSync(variables?.password, user.password);
      if (passwordCheck !== null) {
        delete user.password;
        delete user.birthday;
        delete user.registerDate;
      }
      return {
        status: passwordCheck,
        message: !passwordCheck ? 'Wrong Credentials' : 'Logged in!',
        token: !passwordCheck ? null : new JWT().sign({ user }, EXPIRETIME.H24),
        user: !passwordCheck ? null : user
      };

    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Error to load the user',
        token: null
      };
    }
  }
  // Token
  async auth() {
    let info = new JWT().verify(this.getContext().token!);
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
  // Register
  async register() {
    const user = this.getVariables().user;
    // Check user isn't not
    if (user === null) {
      return {
        status: false,
        message: `Undefined user`,
        user: null
      };
    }
    if (user?.password === null || user?.password === undefined || user?.password === '') {
      return {
        status: false,
        message: `User doesn't have a correct password`,
        user: null
      };
    }
    // Check if the user doesn't exists
    const userCheck = await findOneElement(this.getDb(), this.collection, { email: user?.email });
    if (userCheck !== null) {
      return {
        status: false,
        message: `Email ${user?.email} is already registered`,
        user: null 
      };
    }
    // Check the last register user to assign the ID
    user!.id = await assignDocumentId(this.getDb(), this.collection, { registerDate: -1 });
    // Assign the ISO format date on the registerDate field
    user!.registerDate = new Date().toISOString();
    // Password crypting
    user!.password = bcrypt.hashSync(user!.password, 10);
    const result = await this.add(this.collection, user || {}, 'user');
    // Save the document (register) in the collection
    return {
      status: result.status,
      message: result.message,
      user: result.item
    };
  }
  // Update
  async modify() {
    const user = this.getVariables().user;
    if (user === null) {
      return {
        status: false,
        message: `Undefined user`,
        user: null
      };
    }
    const filter = { id: user?.id };
    const result = await this.update(this.collection, filter, user || {}, 'user');
    return {
      status: result.status,
      message: result.message,
      user: result.item
    };
  }

  async delete() {
    const id = this.getVariables().id;
    if (id === undefined || id === '') {
      return {
        status: false,
        message: `ID not valid. Make sure it's valid to delete the user`,
        user: null
      };
    }
    const result = await this.del(this.collection, { id }, 'user');
    return {
      status: result.status,
      message: result.message
    };
  }
}

export default UsersService;