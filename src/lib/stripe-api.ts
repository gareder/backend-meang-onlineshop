export const STRIPE_OBJECTS = {
  CUSTOMERS: 'customers',
  TOKENS: 'tokens',
  CHARGES: 'charges'
};

export const STRIPE_ACTIONS = {
  CREATE: 'create',
  LIST: 'list',
  GET: 'retrieve',
  UPDATE: 'update',
  DELETE: 'del',
  CREATE_SOURCE: 'createSource',
  GET_SOURCE: 'retrieveSource',
  UPDATE_SOURCE: 'updateSource',
  DELETE_SOURCE: 'deleteSource',
  LIST_SOURCE: 'listSources'
};

class StripeApi {

  private stripe = require('stripe')(process.env.STRIPE_API_KEY, { apiVersion: process.env.STRIPE_API_VERSION});

  async execute(object: string, action: string, ...args: [(string | object), (string | object)?, (string | object)?]) {
    return await this.stripe[object][action](...args);
  }

  protected getError(error: Error) {
    return {
      status: false,
      message: `Error ${error.message}`,
      hasMore: false,
      customer: undefined,
      card: undefined,
      cards: undefined
    };
  }

  protected getPagination(startingAfter: string, endingBefore: string) {
    let pagination = {};
    if (startingAfter !== '' && endingBefore === '') {
      pagination = { starting_after: startingAfter };
    } else if (startingAfter === '' && endingBefore !== '') {
      pagination = { ending_before: endingBefore };
    } else {
      pagination = {};
    }
    return pagination;
  }
}

export default StripeApi;