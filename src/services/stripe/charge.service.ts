import { IPayment } from '../../interfaces/stripe/payment.interface';
import StripeApi, { STRIPE_OBJECTS } from '../../lib/stripe-api';
import { STRIPE_ACTIONS } from '../../lib/stripe-api';
import StripeCustomerService from './customer.service';
import StripeCardService from './card.service';
import { IStripeCharge } from '../../interfaces/stripe/charge.interface';
import { IStock } from '../../interfaces/stock.interface';
import { PubSub } from 'apollo-server-express';
import { Db } from 'mongodb';
import ShopProductsService from '../shop-product.service';

class StripeChargeService extends StripeApi {
  
  // Checking if there's a custoner
  private async getClient(customer: string) {
    return new StripeCustomerService().get(customer);
  }

  async order(payment: IPayment, stockChange: Array<IStock>, db: Db, pubsub: PubSub) {
    const userData = await this.getClient(payment.customer);
    if (userData && userData.status) {
      console.log('CLIENT FOUND');
      if (payment.token !== undefined) {
        // Associating client to card
        const cardCreate = await new StripeCardService().create(payment.customer, payment.token);
        // Updating as default payment method
        await new StripeCustomerService().update(payment.customer, { default_source: cardCreate.card?.id });
        // Updating deleting other cards from the cust
        await new StripeCardService().removeOtherCards(payment.customer, cardCreate.card?.id || '');
      } else if(payment.token === undefined && userData.customer?.default_source === null) {
        return {
          status: false,
          message: 'Client has no default payment method.'
        };
      }
    } else {
      return {
        status: false,
        message: 'No client found. Payment cant be made'
      };
    }
    delete payment.token;
    let result;
    // Converting to zero decimals
    payment.amount = Math.round((+payment.amount + Number.EPSILON) * 100) / 100;
    payment.amount *= 100;
    // Payment
    try {
      new ShopProductsService({}, {}, { db }).updateStock(stockChange, pubsub);
      result = await this.execute(STRIPE_OBJECTS.CHARGES, STRIPE_ACTIONS.CREATE, payment);
      return {
        status: true,
        message: 'Payment successful',
        charge: result
      };
    } catch (error) {
      return this.getError(error);
    }
  }

  async listByCustomer(customer: string, limit: number, startingAfter: string, endingBefore: string) {
    try {
      const pagination = this.getPagination(startingAfter, endingBefore);
      const charges: { has_more: boolean, data: IStripeCharge } = await this.execute(STRIPE_OBJECTS.CHARGES, STRIPE_ACTIONS.LIST,
        { customer, limit, ...pagination }
      );
      return {
        status: true,
        message: 'Customer charges successfully loaded',
        hasMore: charges.has_more,
        charges: charges.data
      };
    } catch (error) {
      return this.getError(error);
    }
  }

}

export default StripeChargeService;