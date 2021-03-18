import { IResolvers } from 'graphql-tools';
import StripeChargeService from '../../../services/stripe/charge.service';


const resolversStripeChargerMutation: IResolvers = {
  Mutation: {
    async chargeOrder(_, { payment, stockChange }, { db, pubsub }) {
      return new StripeChargeService().order(payment, stockChange, db, pubsub);
    }
  },
};

export default resolversStripeChargerMutation;