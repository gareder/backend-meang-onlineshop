import { IResolvers } from 'graphql-tools';
import StripeChargeService from '../../../services/stripe/charge.service';


const resolversStripeChargerMutation: IResolvers = {
  Mutation: {
    async chargeOrder(_, { payment }) {
      return new StripeChargeService().order(payment);
    }
  },
};

export default resolversStripeChargerMutation;