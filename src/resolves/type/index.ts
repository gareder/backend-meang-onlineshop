import GMR from 'graphql-merge-resolvers';
import resolversPlatformProductType from './platform';
import resolversProductType from './product';
import resolversShopProductType from './shop-product';


const TypeResolvers = GMR.merge([
  resolversShopProductType,
  resolversPlatformProductType,
  resolversProductType
]);

export default TypeResolvers;