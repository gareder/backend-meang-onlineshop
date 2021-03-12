import { IPayment } from '../../interfaces/stripe/payment.interface';
import StripeApi, { STRIPE_OBJECTS } from '../../lib/stripe-api';
import { STRIPE_ACTIONS } from '../../lib/stripe-api';
import StripeCustomerService from './customer.service';
import StripeCardService from './card.service';

class StripeChargeService extends StripeApi {
  
  // Checking if there's a custoner
  private async getClient(customer: string) {
    return new StripeCustomerService().get(customer);
  }

  async order(payment: IPayment) {
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

}

export default StripeChargeService;