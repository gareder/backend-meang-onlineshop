import { IResolvers } from 'graphql-tools';
import StripeCustomerService from '../../../services/stripe/customer.service';


const resolversStripeCharge: IResolvers = {

  StripeCharge: {
    typeOrder: (parent) => parent.object,
    amount: (parent) => parent.amount / 100,
    receiptEmail: async (parent) => {
      if (parent.receipt_email) {
        return parent.receipt_email;
      }
      // No email, we look for it with the client
      const userData = await new StripeCustomerService().get(parent.customer);
      return (userData.customer?.email) ? userData.customer?.email : '';
    },
    receiptUrl: (parent) => parent.receipt_url,
    card: (parent) => parent.payment_method,
    created: (parent) => new Date(parent.created * 1000).toISOString()
  }

};

export default resolversStripeCharge;