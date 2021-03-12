import { COLLECTIONS } from '../../config/constants';
import { IStripeCustomer } from '../../interfaces/stripe/customer';
import { IUser } from '../../interfaces/user.interface';
import { findOneElement } from '../../lib/db-operations';
import StripeApi from '../../lib/stripe-api';
import { STRIPE_OBJECTS, STRIPE_ACTIONS } from '../../lib/stripe-api';
import UsersService from '../users.service';
import { Db } from 'mongodb';



class StripeCustomerService extends StripeApi {

  // Custs list
  async list(limit: number, startingAfter: string, endingBefore: string) {
    try {
      const pagination = this.getPagination(startingAfter, endingBefore);
      const customers: { has_more: boolean, data: IStripeCustomer } = await this.execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.LIST, {
        limit, ...pagination
      });
      return {
        status: true,
        message: 'Customers list successfully loaded',
        hasMore: customers.has_more,
        customers: customers.data
      };
    } catch (error) {
      return this.getError(error);
    }
  }

  // Get a cust
  async get(id: string) {
    try {
      const customer = await this.execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.GET, id);
      return {
        status: true,
        message: 'Customer retrieved successfully',
        customer
      };
    } catch (error) {
      return this.getError(error);
    }
  }

  // Create a cust
  async add(name: string, email: string, db: Db) {
    try {
      // Check if user doesn't exists, if user exists send feedback
      const checkUser: { data: Array<IStripeCustomer> } = await this.execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.LIST, { email });
      if (checkUser.data.length > 0) {
        // User exists
        return {
          status: false,
          message: `User with the email ${email} already exists.`
        };
      }
      const customer = await this.execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.CREATE, {
        name, email, description: `${name} (${email})`
      });
      // update the user in DB with the client ID
      const user: IUser = await findOneElement(db, COLLECTIONS.USERS, { email });
      if (user) {
        user.stripeCustomer = customer.id;
        const resultUserOperation = await new UsersService({}, { user }, { db }).modify();
        // if resultUserOperation = false, it didn't execute and we have to delete the created cust in stripe
      }
      return {
        status: true,
        message: `Client ${name} successfully created.`,
        customer
      };
    } catch (error) {
      return this.getError(error);
    }
  }

  async update(id: string, customer: IStripeCustomer) {
    let result;
    try {
      result = await this.execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.UPDATE, id, customer);
      result = {
        status: true,
        message: `User ${id} successfully updated`,
        customer: result
      };
    } catch (error) {
      return this.getError(error);
    }
    return result;
  }

  async delete(id: string, db: Db) {
    let result;
    try {
      result = await this.execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.DELETE, id);
      if (result.deleted) {
        var resultOperation = await db.collection(COLLECTIONS.USERS).updateOne({stripeCustomer: result.id}, { $unset: {stripeCustomer: result.id} });
        return {
          status: (result.deleted && resultOperation) ? true : false,
          message: (result.deleted && resultOperation) ? `User ${id} deleted/updated` : 'User has not been deleted in MongoDB'
        };
      } 
    } catch (error) {
      return this.getError(error);
    }
  }
}


export default StripeCustomerService;