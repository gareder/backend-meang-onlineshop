import GMR from 'graphql-merge-resolvers';
import resolversPlatformProductType from './platform';
import resolversProductType from './product';
import resolversShopProductType from './shop-product';
import TypeStripeResolvers from './type';


const TypeResolvers = GMR.merge([
  resolversShopProductType,
  resolversPlatformProductType,
  resolversProductType,
  TypeStripeResolvers
]);

export default TypeResolvers;