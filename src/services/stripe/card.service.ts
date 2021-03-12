import { IStripeCard } from '../../interfaces/stripe/card';
import StripeApi, { STRIPE_ACTIONS, STRIPE_OBJECTS } from '../../lib/stripe-api';

class StripeCardService extends StripeApi {

  async createToken(card: IStripeCard) {
    let result;
    try {
      result = await this.execute(STRIPE_OBJECTS.TOKENS, STRIPE_ACTIONS.CREATE, {card: {
        number: card.number,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        cvc: card.cvc
      }});
      return {
        status: true,
        message: `Card token ${result.id} successfully created`,
        token: result.id
      };
    } catch (error) {
      return this.getError(error);
    }
  }

  async create(customer: string, tokenCard: string) {
    let result: IStripeCard;
    try {
      result = await this.execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.CREATE_SOURCE, customer, { source: tokenCard });
      return {
        status: true,
        message: `Card with ID: ${result.id} successfully created`,
        id: result.id,
        card: result
      };
    } catch (error) {
      return this.getError(error);
    }
  }

  async getCard(customer: string, card: string) {
    let result: IStripeCard;
    try {
      result = await this.execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.GET_SOURCE, customer, card);
      return {
        status: true,
        message: `Card: ${result.id} details successfully loaded`,
        id: result.id,
        card: result
      };
    } catch (error) {
      return this.getError(error);
    }
  }

  async update(customer: string, card: string, details: object) {
    let result: IStripeCard;
    try {
      result = await this.execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.UPDATE_SOURCE, customer, card, details);
      return {
        status: true,
        message: `Card: ${result.id} updated successfully`,
        id: result.id,
        card: result
      };
    } catch (error) {
      return this.getError(error);
    }
  }

  async delete(customer: string, card: string) {
    let result;
    try {
      result = await this.execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.DELETE_SOURCE, customer, card);
      return {
        status: result.deleted,
        message: result.deleted ? `Card ${result.id} has been deleted successfully` : `Card ${result.id} has not been deleted`,
        id: result.id
      };
    } catch (error) {
      return this.getError(error);
    }
  }

  async list(customer: string, limit: number = 5, startingAfter: string = '', endingBefore: string = '') {
    try {
      let result: {has_more: boolean, data: Array<IStripeCard>};
      const pagination = this.getPagination(startingAfter, endingBefore); 
      result = await this.execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.LIST_SOURCE, customer, { object: 'card', limit, ...pagination });
      return {
        status: true,
        message: `Cards loaded successfully`,
        cards: result.data,
        hasMore: result.has_more
      };
    } catch (error) {
      return this.getError(error);
    }
  }

  async removeOtherCards(customer: string, noDeleteCard: string) {
    const listCards = (await this.list(customer)).cards;
    listCards?.map(async(item: IStripeCard) => {
      if (item.id !== noDeleteCard && noDeleteCard !== '') {
        await this.delete(customer, item.id || '');
      }
    });
  }
}

export default StripeCardService;