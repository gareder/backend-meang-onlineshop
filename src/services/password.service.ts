import { COLLECTIONS, EXPIRETIME } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import { findOneElement, updateOneElement } from '../lib/db-operations';
import JWT from '../lib/jwt';
import MailService from './mail.service';
import ResolversOperationsService from './resolvers-operations.service';
import bcrypt from 'bcrypt';


class PasswordService extends ResolversOperationsService {

  constructor(root: object, variables: object, context: IContextData) {
      super(root, variables, context);
  }

  async sendMail() {
    const email = this.getVariables().user?.email || '';
    if (email === undefined || email === '') {
      return {
        status: false,
        message: 'Email must have a value different than undefined or empty'
      };
    }
    // Get user info
    const user = await findOneElement(this.getDb(), COLLECTIONS.USERS, { email});
    console.log(user);
    // If user = undefined, it doesn't exists
    if (user === undefined || user === null) {
      return {
        status: false,
        message: `User with email ${email} doesn't exists`
      };
    }
    const newUser = {
      id: user.id,
      email
    };
    const token = new JWT().sign({user: newUser}, EXPIRETIME.M15);
    const html = `To reset your password <a href="${process.env.CLIENT_URL}/#/reset/${token}">Click here</a>`;
    const mail = {
      to: email,
      subject: 'Password reset',
      html
    };
    return new MailService().send(mail);
  }

  async change() {
    const id = this.getVariables().user?.id;
    let password = this.getVariables().user?.password;
    // Check ID: not undefined not empty
    if (id === undefined || id === '') {
      return {
        status: false,
        message: 'ID should have a value'
      };
    }
    // Check password: not undefined not empty
    if (password === undefined || password === '' || password === '1234') {
      return {
        status: false,
        message: 'Password should have a correct value'
      };
    }
    // Crypt password
    password = bcrypt.hashSync(password, 10);
    // Update the password
    const result = await this.update(COLLECTIONS.USERS, { id }, { password }, 'users');
    return {
      status: result.status,
      message: (result.status) ? 'Password has been changed' : result.message
    };
  }

}

export default PasswordService;