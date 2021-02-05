import { IResolvers } from 'graphql-tools';
import { transport } from '../../config/mailer';
import JWT from '../../lib/jwt';
import { EXPIRETIME, MESSAGES, COLLECTIONS } from '../../config/constants';
import UsersService from '../../services/users.service';
import { findOneElement, updateOneElement } from '../../lib/db-operations';
import bcrypt from 'bcrypt';
import MailService from '../../services/mail.service';
import PasswordService from '../../services/password.service';


const resolversMailMutation: IResolvers = {
  Mutation: { 
    async sendEmail(_, { mail }) {
      return new MailService().send(mail);
    },
    
    async activeUserEmail(_, { id, email }) {
      return new UsersService(_, {user: {id, email}}, {}).active();
    },

    async activeUserAction(_, { id, birthday, password}, { token, db}) {
      const verify = verifyToken(token, id);
      if (verify?.status === false) {
        return {
          status: false,
          message: verify.message
        };
      }
      return new UsersService(_, { id, user: { birthday, password}}, {token, db}).unblock(true, false);
    },
    
    async resetPassword(_, {email}, {db}) {
      return new PasswordService(_, {user: {email}}, {db}).sendMail();
    },

    async changePassword(_, {id , password}, {db, token}) {
      // Check token
      const verify = verifyToken(token, id);
      if (verify?.status === false) {
        return {
          status: false,
          message: verify.message
        };
      }
      return new PasswordService(_, {user: {id, password}}, {db}).change();
    }
  }
};

function verifyToken(token: string, id: string) {
  // Check token
  const checkToken = new JWT().verify(token);
  if (checkToken === MESSAGES.TOKEN_VERIFICATION_FAILED) {
    return {
      status: false,
      message: 'Token has expired. Check with the admin for more information'
    };
  }
  // If token is valid; assign the user info
  const user = Object.values(checkToken)[0];
  if (user.id !== id) {
    return {
      status: false,
      message: `User token doesn't match.`
    };
  }
}

export default resolversMailMutation;
